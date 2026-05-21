// ==========================================
//  Cozy Bot - Modlog Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createEmbed, errorEmbed } from '../../utils/embed.js';
import { getModLogs } from '../../utils/database.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('modlog')
    .setDescription('View moderation logs')
    .addUserOption((o) => o.setName('user').setDescription('Filter by user'))
    .addIntegerOption((o) =>
      o.setName('limit').setDescription('Number of entries to show (max 25)').setMinValue(1).setMaxValue(25)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const limit = interaction.options.getInteger('limit') || 10;

    const logs = getModLogs(interaction.guild.id, target?.id, limit);

    if (logs.length === 0) {
      return interaction.reply({
        embeds: [
          createEmbed({
            title: 'Moderation Logs',
            description: target ? `No moderation logs for ${target.tag}.` : 'No moderation logs found.',
          }),
        ],
        ephemeral: true,
      });
    }

    const logList = logs
      .map(
        (l) =>
          `**${l.action}** | <@${l.target_id}>\n  By <@${l.moderator_id}> | ${l.reason || 'No reason'}\n  *${l.created_at}*`
      )
      .join('\n\n');

    await interaction.reply({
      embeds: [
        createEmbed({
          title: target ? `Mod Logs: ${target.tag}` : 'Moderation Logs',
          description: logList.length > 4000 ? logList.slice(0, 3996) + '...' : logList,
          color: Config.colors.moderation,
        }),
      ],
      ephemeral: true,
    });
  },
};
