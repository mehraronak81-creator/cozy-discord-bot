// ==========================================
//  Cozy Bot - Avatar Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar of a user')
    .addUserOption((o) => o.setName('user').setDescription('The user to get the avatar of'))
    .addBooleanOption((o) => o.setName('server').setDescription('Show server avatar instead of global')),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const showServer = interaction.options.getBoolean('server');
    const member = interaction.guild.members.cache.get(user.id);

    let avatarUrl;
    let label;

    if (showServer && member?.avatar) {
      avatarUrl = member.displayAvatarURL({ size: 4096, dynamic: true });
      label = 'Server Avatar';
    } else {
      avatarUrl = user.displayAvatarURL({ size: 4096, dynamic: true });
      label = 'Global Avatar';
    }

    const formats = ['png', 'jpg', 'webp'];
    if (avatarUrl.includes('.gif') || user.avatar?.startsWith('a_')) {
      formats.push('gif');
    }

    const links = formats
      .map((f) => `[${f.toUpperCase()}](${user.displayAvatarURL({ extension: f, size: 4096 })})`)
      .join(' | ');

    const embed = createEmbed({
      title: `${user.tag} - ${label}`,
      description: `Download: ${links}`,
      image: avatarUrl,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
