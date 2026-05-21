// ==========================================
//  Cozy Bot - Unmute Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embed.js';
import { addModLog } from '../../utils/database.js';

export default {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout from a member')
    .addUserOption((o) => o.setName('user').setDescription('The user to unmute').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the unmute').setMaxLength(512))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) {
      return interaction.reply({ embeds: [errorEmbed('That user is not in this server.')], ephemeral: true });
    }

    if (!target.isCommunicationDisabled()) {
      return interaction.reply({
        embeds: [errorEmbed('That member is not currently muted.')],
        ephemeral: true,
      });
    }

    try {
      await target.timeout(null, `${reason} | Unmuted by ${interaction.user.tag}`);
      addModLog(interaction.guild.id, 'UNMUTE', target.id, interaction.user.id, reason);

      await interaction.reply({
        embeds: [
          successEmbed(
            `**${target.user.tag}** has been unmuted.\n**Reason:** ${reason}`,
            'Member Unmuted'
          ),
        ],
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`Failed to unmute the user: ${err.message}`)],
        ephemeral: true,
      });
    }
  },
};
