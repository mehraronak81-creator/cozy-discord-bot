// ==========================================
//  Cozy Bot - Role Info Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Get information about a role')
    .addRoleOption((o) => o.setName('role').setDescription('The role to look up').setRequired(true)),

  async execute(interaction) {
    const role = interaction.options.getRole('role');

    const permissions = role.permissions.toArray();
    const permList =
      permissions.length > 0
        ? permissions
            .map((p) =>
              p
                .replace(/([A-Z])/g, ' $1')
                .trim()
            )
            .join(', ')
        : 'None';

    const embed = createEmbed({
      title: `Role Info: ${role.name}`,
      color: role.color || 0x5865f2,
      fields: [
        { name: 'ID', value: role.id, inline: true },
        { name: 'Color', value: role.hexColor, inline: true },
        { name: 'Position', value: `${role.position}/${interaction.guild.roles.cache.size - 1}`, inline: true },
        { name: 'Members', value: `${role.members.size}`, inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
        { name: 'Managed', value: role.managed ? 'Yes (by integration)' : 'No', inline: true },
        {
          name: 'Created',
          value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`,
          inline: true,
        },
        {
          name: 'Permissions',
          value: permList.length > 1024 ? permList.slice(0, 1020) + '...' : permList,
          inline: false,
        },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
