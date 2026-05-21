// ==========================================
//  Cozy Bot - Poll Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

const numberLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const letterLabels = [
  '\u{1F1E6}', '\u{1F1E7}', '\u{1F1E8}', '\u{1F1E9}', '\u{1F1EA}',
  '\u{1F1EB}', '\u{1F1EC}', '\u{1F1ED}', '\u{1F1EE}', '\u{1F1EF}'
];

export default {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption((o) => o.setName('question').setDescription('The poll question').setRequired(true))
    .addStringOption((o) => o.setName('options').setDescription('Options separated by | (e.g. Yes | No | Maybe)').setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const optionsStr = interaction.options.getString('options');
    const options = optionsStr.split('|').map((o) => o.trim()).filter((o) => o.length > 0);

    if (options.length < 2 || options.length > Config.limits.pollMaxOptions) {
      return interaction.reply({
        content: `Please provide between 2 and ${Config.limits.pollMaxOptions} options, separated by \`|\`.`,
        ephemeral: true,
      });
    }

    const optionList = options
      .map((opt, i) => `${letterLabels[i]} **${opt}**`)
      .join('\n');

    const embed = createEmbed({
      title: `Poll: ${question}`,
      description: optionList,
      color: Config.colors.info,
      author: {
        name: `Asked by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      },
    });

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    // Add reactions
    for (let i = 0; i < options.length; i++) {
      await msg.react(letterLabels[i]).catch(() => {});
    }
  },
};
