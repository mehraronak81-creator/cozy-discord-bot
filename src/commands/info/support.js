// ==========================================
//  Cozy Bot - Support Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Get a link to the Void&Co support server'),

  async execute(interaction) {
    const embed = createEmbed({
      title: `${Config.botName} - Support`,
      description: [
        'Need help? Found a bug? Have a suggestion?',
        '',
        `Join the **${Config.developer}** Discord server for support, updates, and announcements.`,
        '',
        `**[Join Support Server](${Config.supportServer})**`,
        '',
        'Our team is here to help you get the most out of Cozy.',
      ].join('\n'),
      color: Config.colors.primary,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
