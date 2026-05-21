// ==========================================
//  Cozy Bot - Invite Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get the bot invite link and support server'),

  async execute(interaction) {
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`;

    const embed = createEmbed({
      title: `Invite ${Config.botName}`,
      description: [
        `Add **${Config.botName}** to your server and join our community!`,
        '',
        `**[Add ${Config.botName} to your server](${inviteUrl})**`,
        '',
        `**[Join Void&Co Support Server](${Config.supportServer})**`,
        '',
        '---',
        `${Config.botName} v${Config.version} | Made by ${Config.developer}`,
      ].join('\n'),
      color: Config.colors.primary,
      thumbnail: interaction.client.user.displayAvatarURL({ size: 256 }),
    });

    await interaction.reply({ embeds: [embed] });
  },
};
