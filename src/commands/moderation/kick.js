// ==========================================
//  Cozy Bot - Kick Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed, modEmbed } from '../../utils/embed.js';
import { isHigherRole, canModerate } from '../../utils/permissions.js';
import { addModLog } from '../../utils/database.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption((o) => o.setName('user').setDescription('The user to kick').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the kick').setMaxLength(512))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) {
      return interaction.reply({ embeds: [errorEmbed('That user is not in this server.')], ephemeral: true });
    }

    if (target.id === interaction.user.id) {
      return interaction.reply({ embeds: [errorEmbed('You cannot kick yourself.')], ephemeral: true });
    }

    if (target.id === interaction.client.user.id) {
      return interaction.reply({ embeds: [errorEmbed('I cannot kick myself.')], ephemeral: true });
    }

    if (!isHigherRole(interaction.member, target)) {
      return interaction.reply({
        embeds: [errorEmbed('You cannot kick a member with a higher or equal role.')],
        ephemeral: true,
      });
    }

    if (!canModerate(interaction.guild.members.me, target)) {
      return interaction.reply({
        embeds: [errorEmbed('I cannot kick this member. My role may be too low.')],
        ephemeral: true,
      });
    }

    try {
      await target.user
        .send({
          embeds: [
            modEmbed('Kicked', target.user.tag, interaction.user.tag, reason).setDescription(
              `You have been kicked from **${interaction.guild.name}**.`
            ),
          ],
        })
        .catch(() => {});

      await target.kick(`${reason} | Kicked by ${interaction.user.tag}`);
      addModLog(interaction.guild.id, 'KICK', target.id, interaction.user.id, reason);

      await interaction.reply({
        embeds: [
          successEmbed(
            `**${target.user.tag}** has been kicked.\n**Reason:** ${reason}`,
            'Member Kicked'
          ),
        ],
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`Failed to kick the user: ${err.message}`)],
        ephemeral: true,
      });
    }
  },
};
