// ==========================================
//  Cozy Bot - Roll Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll dice')
    .addStringOption((o) =>
      o.setName('dice').setDescription('Dice notation (e.g. 2d6, 1d20, 3d8+5) - default: 1d6')
    ),

  async execute(interaction) {
    const input = interaction.options.getString('dice') || '1d6';
    const match = input.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);

    if (!match) {
      return interaction.reply({
        content: 'Invalid dice notation. Use format like `1d6`, `2d20`, `3d8+5`.',
        ephemeral: true,
      });
    }

    const count = Math.min(parseInt(match[1] || '1'), 25);
    const sides = Math.min(parseInt(match[2]), 1000);
    const modifier = parseInt(match[3] || '0');

    if (count < 1 || sides < 2) {
      return interaction.reply({
        content: 'Need at least 1 die with 2+ sides.',
        ephemeral: true,
      });
    }

    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const sum = rolls.reduce((a, b) => a + b, 0);
    const total = sum + modifier;

    const modStr = modifier > 0 ? ` + ${modifier}` : modifier < 0 ? ` - ${Math.abs(modifier)}` : '';

    const embed = createEmbed({
      title: `Dice Roll: ${count}d${sides}${match[3] || ''}`,
      fields: [
        { name: 'Rolls', value: rolls.map((r) => `\`${r}\``).join(' '), inline: false },
        { name: 'Sum', value: `${sum}${modStr}`, inline: true },
        { name: 'Total', value: `**${total}**`, inline: true },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
