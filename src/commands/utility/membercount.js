// ==========================================
//  Cozy Bot - Member Count Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Show the server member count breakdown'),

  async execute(interaction) {
    const { guild } = interaction;

    const total = guild.memberCount;
    const bots = guild.members.cache.filter((m) => m.user.bot).size;
    const humans = total - bots;
    const online = guild.members.cache.filter(
      (m) => m.presence?.status && m.presence.status !== 'offline'
    ).size;

    const embed = createEmbed({
      title: `${guild.name} - Members`,
      color: Config.colors.primary,
      fields: [
        { name: 'Total', value: `${total}`, inline: true },
        { name: 'Humans', value: `${humans}`, inline: true },
        { name: 'Bots', value: `${bots}`, inline: true },
        { name: 'Online', value: `${online}`, inline: true },
      ],
      thumbnail: guild.iconURL({ size: 128 }),
    });

    await interaction.reply({ embeds: [embed] });
  },
};
