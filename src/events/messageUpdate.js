// ==========================================
//  Cozy Bot - Message Update Event
//  Made by Void&Co Development
// ==========================================

import { createEmbed } from '../utils/embed.js';
import { Config } from '../config.js';
import { getGuildSettings } from '../utils/database.js';

export default {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild || newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const settings = getGuildSettings(newMessage.guild.id);
    if (!settings.logging_enabled || !settings.log_channel) return;

    try {
      const logChannel = newMessage.guild.channels.cache.get(settings.log_channel);
      if (!logChannel) return;

      const oldContent = oldMessage.content || '[No content]';
      const newContent = newMessage.content || '[No content]';

      const embed = createEmbed({
        title: 'Message Edited',
        color: Config.colors.info,
        fields: [
          { name: 'Author', value: `${newMessage.author.tag} (<@${newMessage.author.id}>)`, inline: true },
          { name: 'Channel', value: `<#${newMessage.channel.id}>`, inline: true },
          { name: 'Jump to Message', value: `[Click Here](${newMessage.url})`, inline: true },
          { name: 'Before', value: oldContent.length > 1024 ? oldContent.slice(0, 1020) + '...' : oldContent, inline: false },
          { name: 'After', value: newContent.length > 1024 ? newContent.slice(0, 1020) + '...' : newContent, inline: false },
        ],
      });

      await logChannel.send({ embeds: [embed] });
    } catch {
      // Silent fail
    }
  },
};
