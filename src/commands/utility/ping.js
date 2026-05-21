// ==========================================
//  Cozy Bot - Ping Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot latency and API response time'),

  async execute(interaction) {
    const sent = await interaction.reply({
      embeds: [createEmbed({ description: 'Measuring latency...' })],
      fetchReply: true,
    });

    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    const wsLatency = interaction.client.ws.ping;

    const getStatus = (ms) => {
      if (ms < 100) return 'Excellent';
      if (ms < 200) return 'Good';
      if (ms < 400) return 'Average';
      return 'Poor';
    };

    const embed = createEmbed({
      title: 'Pong!',
      color: Config.colors.primary,
      fields: [
        { name: 'Roundtrip', value: `${roundtrip}ms (${getStatus(roundtrip)})`, inline: true },
        { name: 'WebSocket', value: `${wsLatency}ms (${getStatus(wsLatency)})`, inline: true },
        { name: 'Uptime', value: formatUptime(interaction.client.uptime), inline: true },
      ],
    });

    await interaction.editReply({ embeds: [embed] });
  },
};

function formatUptime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
}
