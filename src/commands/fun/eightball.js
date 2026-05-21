// ==========================================
//  Cozy Bot - 8ball Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

const responses = [
  // Positive
  'It is certain.',
  'It is decidedly so.',
  'Without a doubt.',
  'Yes, definitely.',
  'You may rely on it.',
  'As I see it, yes.',
  'Most likely.',
  'Outlook good.',
  'Yes.',
  'Signs point to yes.',
  // Neutral
  'Reply hazy, try again.',
  'Ask again later.',
  'Better not tell you now.',
  'Cannot predict now.',
  'Concentrate and ask again.',
  // Negative
  'Don\'t count on it.',
  'My reply is no.',
  'My sources say no.',
  'Outlook not so good.',
  'Very doubtful.',
];

export default {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8-ball a question')
    .addStringOption((o) => o.setName('question').setDescription('Your question').setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const answer = responses[Math.floor(Math.random() * responses.length)];

    const idx = responses.indexOf(answer);
    let color;
    if (idx < 10) color = Config.colors.success;
    else if (idx < 15) color = Config.colors.warning;
    else color = Config.colors.error;

    const embed = createEmbed({
      title: 'Magic 8-Ball',
      color,
      fields: [
        { name: 'Question', value: question, inline: false },
        { name: 'Answer', value: `**${answer}**`, inline: false },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
