// ==========================================
//  Cozy Bot - Rate Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rate')
    .setDescription('Rate something out of 10')
    .addStringOption((o) => o.setName('thing').setDescription('What to rate').setRequired(true)),

  async execute(interaction) {
    const thing = interaction.options.getString('thing');
    const rating = Math.floor(Math.random() * 11);

    const bar = '|'.repeat(rating) + '-'.repeat(10 - rating);

    let verdict;
    if (rating <= 2) verdict = 'Terrible, honestly.';
    else if (rating <= 4) verdict = 'Not great.';
    else if (rating <= 6) verdict = 'Decent enough.';
    else if (rating <= 8) verdict = 'Pretty good!';
    else verdict = 'Outstanding!';

    const embed = createEmbed({
      title: 'Rating',
      description: `I rate **${thing}** a **${rating}/10**\n\n\`[${bar}]\`\n\n*${verdict}*`,
      color: rating >= 7 ? Config.colors.success : rating >= 4 ? Config.colors.warning : Config.colors.error,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
