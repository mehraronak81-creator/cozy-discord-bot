// ==========================================
//  Cozy Bot - Guild Member Add Event
//  Made by Void&Co Development
// ==========================================

import { logger } from '../utils/logger.js';
import { createEmbed } from '../utils/embed.js';
import { Config } from '../config.js';
import { getGuildSettings } from '../utils/database.js';

export default {
  name: 'guildMemberAdd',
  async execute(member) {
    const settings = getGuildSettings(member.guild.id);

    // Auto-role
    if (settings.auto_role_enabled && settings.auto_role) {
      try {
        const role = member.guild.roles.cache.get(settings.auto_role);
        if (role) {
          await member.roles.add(role);
          logger.debug(`Auto-role: Added ${role.name} to ${member.user.tag}`);
        }
      } catch (err) {
        logger.error(`Auto-role failed for ${member.user.tag}`, err);
      }
    }

    // Welcome message
    if (settings.welcome_enabled && settings.welcome_channel) {
      try {
        const channel = member.guild.channels.cache.get(settings.welcome_channel);
        if (!channel) return;

        const message = (settings.welcome_message || 'Welcome to the server, {user}!')
          .replace(/{user}/g, `<@${member.id}>`)
          .replace(/{username}/g, member.user.username)
          .replace(/{server}/g, member.guild.name)
          .replace(/{membercount}/g, member.guild.memberCount.toString());

        const embed = createEmbed({
          title: 'Welcome!',
          description: message,
          color: Config.colors.success,
          fields: [
            { name: 'Member Count', value: `#${member.guild.memberCount}`, inline: true },
            { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
          ],
          thumbnail: member.user.displayAvatarURL({ size: 256 }),
        });

        await channel.send({ embeds: [embed] });
      } catch (err) {
        logger.error(`Welcome message failed in ${member.guild.name}`, err);
      }
    }

    // Logging
    if (settings.logging_enabled && settings.log_channel) {
      try {
        const logChannel = member.guild.channels.cache.get(settings.log_channel);
        if (!logChannel) return;

        const embed = createEmbed({
          title: 'Member Joined',
          color: Config.colors.success,
          fields: [
            { name: 'User', value: `${member.user.tag} (<@${member.id}>)`, inline: true },
            { name: 'ID', value: member.id, inline: true },
            { name: 'Account Age', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
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
