// ==========================================
//  Cozy Bot - Guild Member Remove Event
//  Made by Void&Co Development
// ==========================================

import { logger } from '../utils/logger.js';
import { createEmbed } from '../utils/embed.js';
import { Config } from '../config.js';
import { getGuildSettings } from '../utils/database.js';

export default {
  name: 'guildMemberRemove',
  async execute(member) {
    const settings = getGuildSettings(member.guild.id);

    // Goodbye message
    if (settings.goodbye_enabled && settings.goodbye_channel) {
      try {
        const channel = member.guild.channels.cache.get(settings.goodbye_channel);
        if (!channel) return;

        const message = (settings.goodbye_message || 'Goodbye, {user}. We will miss you!')
          .replace(/{user}/g, member.user.username)
          .replace(/{username}/g, member.user.username)
          .replace(/{server}/g, member.guild.name)
          .replace(/{membercount}/g, member.guild.memberCount.toString());

        const embed = createEmbed({
          title: 'Goodbye',
          description: message,
          color: Config.colors.error,
          fields: [
            { name: 'Member Count', value: `#${member.guild.memberCount}`, inline: true },
            { name: 'Joined', value: member.joinedAt ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true },
          ],
          thumbnail: member.user.displayAvatarURL({ size: 256 }),
        });

        await channel.send({ embeds: [embed] });
      } catch (err) {
        logger.error(`Goodbye message failed in ${member.guild.name}`, err);
      }
    }

    // Logging
    if (settings.logging_enabled && settings.log_channel) {
      try {
        const logChannel = member.guild.channels.cache.get(settings.log_channel);
        if (!logChannel) return;

        const roles = member.roles.cache
          .filter((r) => r.id !== member.guild.id)
          .map((r) => r.name)
          .join(', ') || 'None';

        const embed = createEmbed({
          title: 'Member Left',
          color: Config.colors.error,
          fields: [
            { name: 'User', value: `${member.user.tag} (<@${member.id}>)`, inline: true },
            { name: 'ID', value: member.id, inline: true },
            { name: 'Roles', value: roles.length > 1024 ? roles.slice(0, 1020) + '...' : roles, inline: false },
          ],
          thumbnail: member.user.displayAvatarURL({ size: 128 }),
        });

        await logChannel.send({ embeds: [embed] });
      } catch {
        // Silent fail
      }
    }
  },
};
