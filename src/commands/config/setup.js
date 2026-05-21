// ==========================================
//  Cozy Bot - Setup Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { successEmbed, errorEmbed, createEmbed } from '../../utils/embed.js';
import { getGuildSettings, updateGuildSetting } from '../../utils/database.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure Cozy for your server')
    .addSubcommand((sub) =>
      sub
        .setName('welcome')
        .setDescription('Configure the welcome system')
        .addChannelOption((o) =>
          o.setName('channel').setDescription('Welcome channel').addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
        .addStringOption((o) =>
          o.setName('message').setDescription('Welcome message ({user}, {username}, {server}, {membercount})')
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('goodbye')
        .setDescription('Configure the goodbye system')
        .addChannelOption((o) =>
          o.setName('channel').setDescription('Goodbye channel').addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
        .addStringOption((o) =>
          o.setName('message').setDescription('Goodbye message ({user}, {username}, {server}, {membercount})')
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('logs')
        .setDescription('Configure the logging system')
        .addChannelOption((o) =>
          o.setName('channel').setDescription('Log channel').addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('modlog')
        .setDescription('Configure the moderation log channel')
        .addChannelOption((o) =>
          o.setName('channel').setDescription('Mod log channel').addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('autorole')
        .setDescription('Configure auto-role for new members')
        .addRoleOption((o) => o.setName('role').setDescription('Role to assign to new members').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('tickets')
        .setDescription('Configure the ticket system')
        .addChannelOption((o) =>
          o
            .setName('category')
            .setDescription('Category for tickets')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('suggestions')
        .setDescription('Configure the suggestions system')
        .addChannelOption((o) =>
          o.setName('channel').setDescription('Suggestions channel').addChannelTypes(ChannelType.GuildText).setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('disable')
        .setDescription('Disable a feature')
        .addStringOption((o) =>
          o
            .setName('feature')
            .setDescription('Feature to disable')
            .setRequired(true)
            .addChoices(
              { name: 'Welcome Messages', value: 'welcome' },
              { name: 'Goodbye Messages', value: 'goodbye' },
              { name: 'Logging', value: 'logging' },
              { name: 'Auto-Role', value: 'auto_role' },
              { name: 'Tickets', value: 'tickets' }
            )
        )
    )
    .addSubcommand((sub) =>
      sub.setName('view').setDescription('View current server configuration')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'welcome') {
      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');

      updateGuildSetting(interaction.guild.id, 'welcome_channel', channel.id);
      updateGuildSetting(interaction.guild.id, 'welcome_enabled', 1);
      if (message) updateGuildSetting(interaction.guild.id, 'welcome_message', message);

      await interaction.reply({
        embeds: [
          successEmbed(
            `Welcome messages enabled in <#${channel.id}>.${message ? `\n**Message:** ${message}` : ''}`,
            'Welcome Setup'
          ),
        ],
      });
    }

    if (sub === 'goodbye') {
      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');

      updateGuildSetting(interaction.guild.id, 'goodbye_channel', channel.id);
      updateGuildSetting(interaction.guild.id, 'goodbye_enabled', 1);
      if (message) updateGuildSetting(interaction.guild.id, 'goodbye_message', message);

      await interaction.reply({
        embeds: [
          successEmbed(
            `Goodbye messages enabled in <#${channel.id}>.${message ? `\n**Message:** ${message}` : ''}`,
            'Goodbye Setup'
          ),
        ],
      });
    }

    if (sub === 'logs') {
      const channel = interaction.options.getChannel('channel');
      updateGuildSetting(interaction.guild.id, 'log_channel', channel.id);
      updateGuildSetting(interaction.guild.id, 'logging_enabled', 1);

      await interaction.reply({
        embeds: [successEmbed(`Logging enabled in <#${channel.id}>.`, 'Logging Setup')],
      });
    }

    if (sub === 'modlog') {
      const channel = interaction.options.getChannel('channel');
      updateGuildSetting(interaction.guild.id, 'mod_log_channel', channel.id);

      await interaction.reply({
        embeds: [successEmbed(`Mod log channel set to <#${channel.id}>.`, 'Mod Log Setup')],
      });
    }

    if (sub === 'autorole') {
      const role = interaction.options.getRole('role');

      if (role.managed) {
        return interaction.reply({
          embeds: [errorEmbed('Cannot use a managed/integration role as auto-role.')],
          ephemeral: true,
        });
      }

      if (role.position >= interaction.guild.members.me.roles.highest.position) {
        return interaction.reply({
          embeds: [errorEmbed('That role is higher than my highest role. I cannot assign it.')],
          ephemeral: true,
        });
      }

      updateGuildSetting(interaction.guild.id, 'auto_role', role.id);
      updateGuildSetting(interaction.guild.id, 'auto_role_enabled', 1);

      await interaction.reply({
        embeds: [successEmbed(`Auto-role set to ${role}. New members will receive this role.`, 'Auto-Role Setup')],
      });
    }

    if (sub === 'tickets') {
      const category = interaction.options.getChannel('category');
      updateGuildSetting(interaction.guild.id, 'ticket_category', category.id);
      updateGuildSetting(interaction.guild.id, 'tickets_enabled', 1);

      await interaction.reply({
        embeds: [successEmbed(`Ticket system enabled. Tickets will be created in **${category.name}**.`, 'Ticket Setup')],
      });
    }

    if (sub === 'suggestions') {
      const channel = interaction.options.getChannel('channel');
      updateGuildSetting(interaction.guild.id, 'suggestion_channel', channel.id);

      await interaction.reply({
        embeds: [successEmbed(`Suggestions channel set to <#${channel.id}>.`, 'Suggestions Setup')],
      });
    }

    if (sub === 'disable') {
      const feature = interaction.options.getString('feature');
      updateGuildSetting(interaction.guild.id, `${feature}_enabled`, 0);

      const featureNames = {
        welcome: 'Welcome Messages',
        goodbye: 'Goodbye Messages',
        logging: 'Logging',
        auto_role: 'Auto-Role',
        tickets: 'Tickets',
      };

      await interaction.reply({
        embeds: [successEmbed(`**${featureNames[feature]}** has been disabled.`, 'Feature Disabled')],
      });
    }

    if (sub === 'view') {
      const s = getGuildSettings(interaction.guild.id);

      const status = (enabled) => (enabled ? 'Enabled' : 'Disabled');

      const embed = createEmbed({
        title: `${Config.botName} - Server Configuration`,
        color: Config.colors.primary,
        fields: [
          {
            name: 'Welcome System',
            value: `**Status:** ${status(s.welcome_enabled)}\n**Channel:** ${s.welcome_channel ? `<#${s.welcome_channel}>` : 'Not set'}`,
            inline: true,
          },
          {
            name: 'Goodbye System',
            value: `**Status:** ${status(s.goodbye_enabled)}\n**Channel:** ${s.goodbye_channel ? `<#${s.goodbye_channel}>` : 'Not set'}`,
            inline: true,
          },
          {
            name: 'Logging',
            value: `**Status:** ${status(s.logging_enabled)}\n**Channel:** ${s.log_channel ? `<#${s.log_channel}>` : 'Not set'}`,
            inline: true,
          },
          {
            name: 'Auto-Role',
            value: `**Status:** ${status(s.auto_role_enabled)}\n**Role:** ${s.auto_role ? `<@&${s.auto_role}>` : 'Not set'}`,
            inline: true,
          },
          {
            name: 'Tickets',
            value: `**Status:** ${status(s.tickets_enabled)}\n**Category:** ${s.ticket_category ? `Set` : 'Not set'}`,
            inline: true,
          },
          {
            name: 'Suggestions',
            value: `**Channel:** ${s.suggestion_channel ? `<#${s.suggestion_channel}>` : 'Not set'}`,
            inline: true,
          },
        ],
      });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
