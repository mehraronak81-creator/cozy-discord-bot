// ==========================================
//  Cozy Bot - About Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, version as djsVersion } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Learn about Cozy and Void&Co Development'),

  async execute(interaction) {
    const { client } = interaction;

    const totalMembers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
    const totalChannels = client.channels.cache.size;

    const uptime = formatUptime(client.uptime);
    const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const embed = createEmbed({
      title: `${Config.botName} - About`,
      description: [
        `**${Config.botName}** is a versatile, feature-rich Discord bot built by **${Config.developer}**.`,
        '',
        'Designed for server management, moderation, utilities, and fun -- Cozy brings everything you need into one clean package.',
        '',
        `**Version:** ${Config.version}`,
        `**Developer:** ${Config.developer}`,
        `**Library:** discord.js v${djsVersion}`,
        `**Runtime:** Node.js ${process.version}`,
      ].join('\n'),
      color: Config.colors.primary,
      fields: [
        { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Users', value: `${totalMembers.toLocaleString()}`, inline: true },
        { name: 'Channels', value: `${totalChannels}`, inline: true },
        { name: 'Commands', value: `${client.commands.size}`, inline: true },
        { name: 'Uptime', value: uptime, inline: true },
        { name: 'Memory', value: `${memUsage} MB`, inline: true },
        {
          name: 'Links',
          value: [
            `[Support Server](${Config.supportServer})`,
            `[Invite Bot](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`,
          ].join(' | '),
          inline: false,
        },
      ],
      thumbnail: client.user.displayAvatarURL({ size: 256 }),
    });

    await interaction.reply({ embeds: [embed] });
  },
};

function formatUptime(ms) {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}
