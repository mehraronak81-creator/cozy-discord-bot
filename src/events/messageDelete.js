// ==========================================
//  Cozy Bot - Message Delete Event
//  Made by Void&Co Development
// ==========================================

import { createEmbed } from '../utils/embed.js';
import { Config } from '../config.js';
import { getGuildSettings } from '../utils/database.js';

export default {
  name: 'messageDelete',
  async execute(message) {
    if (!message.guild || message.author?.bot) return;

    const settings = getGuildSettings(message.guild.id);
    if (!settings.logging_enabled || !settings.log_channel) return;

    try {
      const logChannel = message.guild.channels.cache.get(settings.log_channel);
      if (!logChannel) return;

      const content = message.content || '[No text content]';

      const embed = createEmbed({
        title: 'Message Deleted',
        color: Config.colors.warning,
        fields: [
          { name: 'Author', value: message.author ? `${message.author.tag} (<@${message.author.id}>)` : 'Unknown', inline: true },
          { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
          { name: 'Content', value: content.length > 1024 ? content.slice(0, 1020) + '...' : content, inline: false },
        ],
      });

      if (message.attachments.size > 0) {
        embed.addFields({
          name: 'Attachments',
          value: message.attachments.map((a) => a.name).join(', '),
          inline: false,
        });
      }

      await logChannel.send({ embeds: [embed] });
    } catch {
      // Silent fail
    }
  },
};
