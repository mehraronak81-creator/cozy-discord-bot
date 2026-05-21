// ==========================================
//  Cozy Bot - User Info Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get information about a user')
    .addUserOption((o) => o.setName('user').setDescription('The user to look up (default: yourself)')),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const fields = [
      { name: 'Username', value: user.username, inline: true },
      { name: 'Display Name', value: user.globalName || user.username, inline: true },
      { name: 'ID', value: user.id, inline: true },
      { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
      {
        name: 'Account Created',
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>\n(<t:${Math.floor(user.createdTimestamp / 1000)}:R>)`,
        inline: true,
      },
    ];

    if (member) {
      fields.push(
        {
          name: 'Joined Server',
          value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>\n(<t:${Math.floor(member.joinedTimestamp / 1000)}:R>)`,
          inline: true,
        },
        {
          name: 'Nickname',
          value: member.nickname || 'None',
          inline: true,
        },
        {
          name: 'Highest Role',
          value: member.roles.highest.id === interaction.guild.id ? 'None' : `${member.roles.highest}`,
          inline: true,
        },
        {
          name: `Roles [${member.roles.cache.size - 1}]`,
          value:
            member.roles.cache
              .filter((r) => r.id !== interaction.guild.id)
              .sort((a, b) => b.position - a.position)
              .map((r) => `${r}`)
              .slice(0, 15)
              .join(', ') || 'None',
          inline: false,
        },
        {
          name: 'Boosting',
          value: member.premiumSince
            ? `Since <t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`
            : 'No',
          inline: true,
        }
      );
    }

    const embed = createEmbed({
      title: `User Info: ${user.tag}`,
      color: member?.displayColor || Config.colors.primary,
      thumbnail: user.displayAvatarURL({ size: 256, dynamic: true }),
      fields,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
