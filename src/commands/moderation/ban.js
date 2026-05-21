// ==========================================
//  Cozy Bot - Ban Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed, modEmbed } from '../../utils/embed.js';
import { isHigherRole, canModerate } from '../../utils/permissions.js';
import { addModLog } from '../../utils/database.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption((o) => o.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption((o) => o.setName('reason').setDescription('Reason for the ban').setMaxLength(512))
    .addIntegerOption((o) =>
      o.setName('days').setDescription('Days of messages to delete (0-7)').setMinValue(0).setMaxValue(7)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const days = interaction.options.getInteger('days') || 0;
    const member = interaction.guild.members.cache.get(target.id);

    // Validation
    if (target.id === interaction.user.id) {
      return interaction.reply({ embeds: [errorEmbed('You cannot ban yourself.')], ephemeral: true });
    }

    if (target.id === interaction.client.user.id) {
      return interaction.reply({ embeds: [errorEmbed('I cannot ban myself.')], ephemeral: true });
    }

    if (member) {
      if (!isHigherRole(interaction.member, member)) {
        return interaction.reply({
          embeds: [errorEmbed('You cannot ban a member with a higher or equal role.')],
          ephemeral: true,
        });
      }
      if (!canModerate(interaction.guild.members.me, member)) {
        return interaction.reply({
          embeds: [errorEmbed('I cannot ban this member. My role may be too low.')],
          ephemeral: true,
        });
      }
    }

    try {
      // DM the user before banning
      if (member) {
        await target
          .send({
            embeds: [
              modEmbed('Banned', target.tag, interaction.user.tag, reason).setDescription(
                `You have been banned from **${interaction.guild.name}**.`
              ),
            ],
          })
          .catch(() => {}); // Ignore if DMs are closed
      }

      await interaction.guild.members.ban(target, {
        deleteMessageSeconds: days * 86400,
        reason: `${reason} | Banned by ${interaction.user.tag}`,
      });

      addModLog(interaction.guild.id, 'BAN', target.id, interaction.user.id, reason);

      await interaction.reply({
        embeds: [
          successEmbed(
            `**${target.tag}** has been banned.\n**Reason:** ${reason}`,
            'Member Banned'
          ),
        ],
      });
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`Failed to ban the user: ${err.message}`)],
        ephemeral: true,
      });
    }
  },
};
