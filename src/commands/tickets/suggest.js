// ==========================================
//  Cozy Bot - Suggest Command
//  Made by Void&Co Development
// ==========================================

import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { successEmbed, errorEmbed, createEmbed } from '../../utils/embed.js';
import { addSuggestion, getSuggestion, updateSuggestionStatus } from '../../utils/database.js';
import { getGuildSettings } from '../../utils/database.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Submit or manage suggestions')
    .addSubcommand((sub) =>
      sub
        .setName('submit')
        .setDescription('Submit a suggestion')
        .addStringOption((o) => o.setName('idea').setDescription('Your suggestion').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('approve')
        .setDescription('Approve a suggestion (staff only)')
        .addIntegerOption((o) => o.setName('id').setDescription('Suggestion ID').setRequired(true))
        .addStringOption((o) => o.setName('response').setDescription('Staff response'))
    )
    .addSubcommand((sub) =>
      sub
        .setName('deny')
        .setDescription('Deny a suggestion (staff only)')
        .addIntegerOption((o) => o.setName('id').setDescription('Suggestion ID').setRequired(true))
        .addStringOption((o) => o.setName('response').setDescription('Staff response'))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const settings = getGuildSettings(interaction.guild.id);

    if (sub === 'submit') {
      const idea = interaction.options.getString('idea');

      if (!settings.suggestion_channel) {
        return interaction.reply({
          embeds: [errorEmbed('Suggestions channel is not configured. An admin can set it with `/setup suggestions`.')],
          ephemeral: true,
        });
      }

      const channel = interaction.guild.channels.cache.get(settings.suggestion_channel);
      if (!channel) {
        return interaction.reply({
          embeds: [errorEmbed('The configured suggestions channel no longer exists.')],
          ephemeral: true,
        });
      }

      const embed = createEmbed({
        title: 'New Suggestion',
        description: idea,
        color: Config.colors.info,
        fields: [
          { name: 'Submitted by', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Status', value: 'Pending', inline: true },
        ],
      });

      const msg = await channel.send({ embeds: [embed] });

      // Add vote reactions
      await msg.react('\u{1F44D}').catch(() => {});
      await msg.react('\u{1F44E}').catch(() => {});

      addSuggestion(interaction.guild.id, msg.id, interaction.user.id, idea);

      await interaction.reply({
        embeds: [successEmbed(`Your suggestion has been submitted to <#${channel.id}>.`, 'Suggestion Submitted')],
        ephemeral: true,
      });
    }

    if (sub === 'approve' || sub === 'deny') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return interaction.reply({
          embeds: [errorEmbed('You need the Manage Messages permission to manage suggestions.')],
          ephemeral: true,
        });
      }

      const id = interaction.options.getInteger('id');
      const response = interaction.options.getString('response');
      const suggestion = getSuggestion(id);

      if (!suggestion) {
        return interaction.reply({
          embeds: [errorEmbed(`Suggestion #${id} not found.`)],
          ephemeral: true,
        });
      }

      const status = sub === 'approve' ? 'approved' : 'denied';
      const color = sub === 'approve' ? Config.colors.success : Config.colors.error;
      updateSuggestionStatus(id, status, response);

      await interaction.reply({
        embeds: [
          successEmbed(
            `Suggestion **#${id}** has been **${status}**.${response ? `\n**Response:** ${response}` : ''}`,
            `Suggestion ${status.charAt(0).toUpperCase() + status.slice(1)}`
          ),
        ],
      });
    }
  },
};
