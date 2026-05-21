// ==========================================
//  Cozy Bot - Ticket Command
//  Made by Void&Co Development
// ==========================================

import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { successEmbed, errorEmbed, createEmbed } from '../../utils/embed.js';
import { createTicket, getTicket, closeTicket, getOpenTickets } from '../../utils/database.js';
import { getGuildSettings } from '../../utils/database.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Manage support tickets')
    .addSubcommand((sub) =>
      sub
        .setName('create')
        .setDescription('Create a new support ticket')
        .addStringOption((o) => o.setName('subject').setDescription('Brief description of your issue').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('close').setDescription('Close the current ticket')
    )
    .addSubcommand((sub) =>
      sub.setName('list').setDescription('List all open tickets (staff only)')
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const settings = getGuildSettings(interaction.guild.id);

    if (sub === 'create') {
      const subject = interaction.options.getString('subject');

      // Check if tickets are enabled
      if (!settings.tickets_enabled) {
        return interaction.reply({
          embeds: [errorEmbed('The ticket system is not enabled on this server. An admin can enable it with `/setup tickets`.')],
          ephemeral: true,
        });
      }

      // Check open ticket limit
      const userTickets = getOpenTickets(interaction.guild.id, interaction.user.id);
      if (userTickets.length >= 3) {
        return interaction.reply({
          embeds: [errorEmbed('You already have 3 open tickets. Please close one before opening a new one.')],
          ephemeral: true,
        });
      }

      await interaction.deferReply({ ephemeral: true });

      try {
        const ticketNumber = getOpenTickets(interaction.guild.id).length + 1;
        const channelName = `ticket-${interaction.user.username}-${ticketNumber}`.toLowerCase().replace(/[^a-z0-9-]/g, '');

        const channel = await interaction.guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: settings.ticket_category || null,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            },
            {
              id: interaction.client.user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
            },
          ],
        });

        createTicket(interaction.guild.id, channel.id, interaction.user.id, subject);

        const closeButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('ticket_close')
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Danger)
        );

        const ticketEmbed = createEmbed({
          title: `Ticket: ${subject}`,
          description: [
            `Welcome <@${interaction.user.id}>,`,
            '',
            'A staff member will be with you shortly.',
            'Please describe your issue in detail.',
            '',
            'Click the button below to close this ticket when resolved.',
          ].join('\n'),
          color: Config.colors.info,
          fields: [
            { name: 'Created by', value: `<@${interaction.user.id}>`, inline: true },
            { name: 'Subject', value: subject, inline: true },
          ],
        });

        await channel.send({ embeds: [ticketEmbed], components: [closeButton] });

        await interaction.editReply({
          embeds: [successEmbed(`Your ticket has been created: <#${channel.id}>`, 'Ticket Created')],
        });
      } catch (err) {
        await interaction.editReply({
          embeds: [errorEmbed(`Failed to create ticket: ${err.message}`)],
        });
      }
    }

    if (sub === 'close') {
      const ticket = getTicket(interaction.channel.id);

      if (!ticket) {
        return interaction.reply({
          embeds: [errorEmbed('This channel is not a ticket.')],
          ephemeral: true,
        });
      }

      if (ticket.status === 'closed') {
        return interaction.reply({
          embeds: [errorEmbed('This ticket is already closed.')],
          ephemeral: true,
        });
      }

      await interaction.reply({
        embeds: [createEmbed({ title: 'Ticket Closing', description: 'This ticket will be deleted in 5 seconds...', color: Config.colors.warning })],
      });

      closeTicket(interaction.channel.id);

      setTimeout(async () => {
        try {
          await interaction.channel.delete();
        } catch {
          // Channel may already be deleted
        }
      }, 5000);
    }

    if (sub === 'list') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return interaction.reply({
          embeds: [errorEmbed('You need the Manage Messages permission to view all tickets.')],
          ephemeral: true,
        });
      }

      const tickets = getOpenTickets(interaction.guild.id);

      if (tickets.length === 0) {
        return interaction.reply({
          embeds: [createEmbed({ title: 'Open Tickets', description: 'There are no open tickets.' })],
          ephemeral: true,
        });
      }

      const ticketList = tickets
        .map((t) => `<#${t.channel_id}> | <@${t.user_id}> | ${t.subject}\n*Opened: ${t.created_at}*`)
        .join('\n\n');

      await interaction.reply({
        embeds: [
          createEmbed({
            title: `Open Tickets [${tickets.length}]`,
            description: ticketList,
            color: Config.colors.info,
          }),
        ],
        ephemeral: true,
      });
    }
  },

  // Handle close button
  async handleButton(interaction) {
    const ticket = getTicket(interaction.channel.id);

    if (!ticket || ticket.status === 'closed') {
      return interaction.reply({
        embeds: [errorEmbed('This ticket cannot be closed.')],
        ephemeral: true,
      });
    }

    await interaction.reply({
      embeds: [createEmbed({ title: 'Ticket Closing', description: `Closed by <@${interaction.user.id}>. Deleting in 5 seconds...`, color: Config.colors.warning })],
    });

    closeTicket(interaction.channel.id);

    setTimeout(async () => {
      try {
        await interaction.channel.delete();
      } catch {
        // Channel may already be deleted
      }
    }, 5000);
  },
};
