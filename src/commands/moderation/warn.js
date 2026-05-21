// ==========================================
//  Cozy Bot - Warn Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed, createEmbed } from '../../utils/embed.js';
import { addWarning, getWarnings, clearWarnings, removeWarning } from '../../utils/database.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Manage warnings for a member')
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Warn a member')
        .addUserOption((o) => o.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption((o) => o.setName('reason').setDescription('Reason for the warning').setMaxLength(512))
    )
    .addSubcommand((sub) =>
      sub
        .setName('list')
        .setDescription('View warnings for a member')
        .addUserOption((o) => o.setName('user').setDescription('The user to check').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Remove a specific warning by ID')
        .addIntegerOption((o) => o.setName('id').setDescription('Warning ID to remove').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('clear')
        .setDescription('Clear all warnings for a member')
        .addUserOption((o) => o.setName('user').setDescription('The user to clear warnings for').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {
      const target = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (target.bot) {
        return interaction.reply({ embeds: [errorEmbed('You cannot warn a bot.')], ephemeral: true });
      }

      addWarning(interaction.guild.id, target.id, interaction.user.id, reason);
      const warnings = getWarnings(interaction.guild.id, target.id);

      // DM the user
      await target
        .send({
          embeds: [
            createEmbed({
              title: 'Warning Received',
              description: `You have been warned in **${interaction.guild.name}**.`,
              color: Config.colors.warning,
              fields: [
                { name: 'Reason', value: reason, inline: false },
                { name: 'Total Warnings', value: `${warnings.length}/${Config.limits.maxWarnings}`, inline: true },
              ],
            }),
          ],
        })
        .catch(() => {});

      await interaction.reply({
        embeds: [
          successEmbed(
            `**${target.tag}** has been warned.\n**Reason:** ${reason}\n**Total Warnings:** ${warnings.length}/${Config.limits.maxWarnings}`,
            'Warning Issued'
          ),
        ],
      });

      // Auto-action at max warnings
      if (warnings.length >= Config.limits.maxWarnings) {
        await interaction.followUp({
          embeds: [
            createEmbed({
              title: 'Warning Threshold Reached',
              description: `**${target.tag}** has reached **${Config.limits.maxWarnings}** warnings. Consider taking further action.`,
              color: Config.colors.error,
            }),
          ],
        });
      }
    }

    if (sub === 'list') {
      const target = interaction.options.getUser('user');
      const warnings = getWarnings(interaction.guild.id, target.id);

      if (warnings.length === 0) {
        return interaction.reply({
          embeds: [createEmbed({ title: 'Warnings', description: `**${target.tag}** has no warnings.` })],
          ephemeral: true,
        });
      }

      const warnList = warnings
        .slice(0, 10)
        .map(
          (w, i) =>
            `**#${w.id}** - ${w.reason}\n  *By <@${w.moderator_id}> on ${w.created_at}*`
        )
        .join('\n\n');

      await interaction.reply({
        embeds: [
          createEmbed({
            title: `Warnings for ${target.tag}`,
            description: warnList,
            color: Config.colors.warning,
            fields: [{ name: 'Total', value: `${warnings.length}/${Config.limits.maxWarnings}`, inline: true }],
          }),
        ],
        ephemeral: true,
      });
    }

    if (sub === 'remove') {
      const id = interaction.options.getInteger('id');
      const result = removeWarning(id);

      if (result.changes === 0) {
        return interaction.reply({ embeds: [errorEmbed(`Warning #${id} not found.`)], ephemeral: true });
      }

      await interaction.reply({
        embeds: [successEmbed(`Warning **#${id}** has been removed.`, 'Warning Removed')],
      });
    }

    if (sub === 'clear') {
      const target = interaction.options.getUser('user');
      const result = clearWarnings(interaction.guild.id, target.id);

      await interaction.reply({
        embeds: [
          successEmbed(
            `Cleared **${result.changes}** warnings for **${target.tag}**.`,
            'Warnings Cleared'
          ),
        ],
      });
    }
  },
};
