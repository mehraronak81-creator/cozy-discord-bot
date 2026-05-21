// ==========================================
//  Cozy Bot - Mute (Timeout) Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embed.js';
import { isHigherRole, canModerate } from '../../utils/permissions.js';
import { addModLog } from '../../utils/database.js';
import ms from 'ms';

export default {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout a member (prevent them from chatting)')
    .addUserOption((o) => o.setName('user').setDescription('The user to mute').setRequired(true))
    .addStringOption((o) =>
      o.setName('duration').setDescription('Duration (e.g. 10m, 1h, 1d, 7d)').setRequired(true)
    )
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the mute').setMaxLength(512))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) {
      return interaction.reply({ embeds: [errorEmbed('That user is not in this server.')], ephemeral: true });
    }

    if (target.id === interaction.user.id) {
      return interaction.reply({ embeds: [errorEmbed('You cannot mute yourself.')], ephemeral: true });
    }

    if (!isHigherRole(interaction.member, target)) {
      return interaction.reply({
        embeds: [errorEmbed('You cannot mute a member with a higher or equal role.')],
        ephemeral: true,
      });
    }

    if (!canModerate(interaction.guild.members.me, target)) {
      return interaction.reply({
        embeds: [errorEmbed('I cannot mute this member. My role may be too low.')],
        ephemeral: true,
      });
    }

    const duration = ms(durationStr);
    if (!duration || duration < 5000 || duration > 2_419_200_000) {
      return interaction.reply({
        embeds: [errorEmbed('Invalid duration. Use formats like `10m`, `1h`, `1d`. Max: 28 days.')],
        ephemeral: true,
      });
    }

    try {
      await target.timeout(duration, `${reason} | Muted by ${interaction.user.tag}`);
      addModLog(interaction.guild.id, 'MUTE', target.id, interaction.user.id, `${reason} (${durationStr})`);

      await interaction.reply({
        embeds: [
          successEmbed(
            `**${target.user.tag}** has been muted for **${durationStr}**.\n**Reason:** ${reason}`,
            'Member Muted'
          ),
        ],
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`Failed to mute the user: ${err.message}`)],
        ephemeral: true,
      });
    }
  },
};
