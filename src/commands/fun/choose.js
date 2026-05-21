// ==========================================
//  Cozy Bot - Choose Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Let the bot choose between multiple options')
    .addStringOption((o) =>
      o.setName('options').setDescription('Options separated by | (e.g. Pizza | Pasta | Salad)').setRequired(true)
    ),

  async execute(interaction) {
    const input = interaction.options.getString('options');
    const options = input.split('|').map((o) => o.trim()).filter((o) => o.length > 0);

    if (options.length < 2) {
      return interaction.reply({
        content: 'Please provide at least 2 options, separated by `|`.',
        ephemeral: true,
      });
    }

    const chosen = options[Math.floor(Math.random() * options.length)];

    const embed = createEmbed({
      title: 'I Choose...',
      description: `Out of ${options.length} options, I pick:\n\n**${chosen}**`,
      fields: [
        { name: 'Options', value: options.map((o, i) => `${i + 1}. ${o}`).join('\n'), inline: false },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
