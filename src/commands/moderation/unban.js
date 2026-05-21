// ==========================================
//  Cozy Bot - Unban Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embed.js';
import { addModLog } from '../../utils/database.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the server')
    .addStringOption((o) => o.setName('user_id').setDescription('The user ID to unban').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the unban').setMaxLength(512))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('user_id');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const ban = await interaction.guild.bans.fetch(userId).catch(() => null);
      if (!ban) {
        return interaction.reply({
          embeds: [errorEmbed('That user is not banned or the ID is invalid.')],
          ephemeral: true,
        });
      }

      await interaction.guild.members.unban(userId, `${reason} | Unbanned by ${interaction.user.tag}`);
      addModLog(interaction.guild.id, 'UNBAN', userId, interaction.user.id, reason);

      await interaction.reply({
        embeds: [
          successEmbed(
            `**${ban.user.tag}** (${userId}) has been unbanned.\n**Reason:** ${reason}`,
            'User Unbanned'
          ),
        ],
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`Failed to unban the user: ${err.message}`)],
        ephemeral: true,
      });
    }
  },
};
