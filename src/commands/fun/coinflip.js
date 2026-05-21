// ==========================================
//  Cozy Bot - Coinflip Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin - heads or tails'),

  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

    const embed = createEmbed({
      title: 'Coin Flip',
      description: `The coin landed on **${result}**!`,
      color: result === 'Heads' ? Config.colors.success : Config.colors.info,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
