// ==========================================
//  Cozy Bot - Embed Builder Utilities
//  Made by Void&Co Development
// ==========================================

import { EmbedBuilder } from 'discord.js';
import { Config } from '../config.js';

/**
 * Create a standard branded embed
 */
export function createEmbed(options = {}) {
  const embed = new EmbedBuilder()
    .setColor(options.color || Config.colors.primary)
    .setFooter({
      text: `${Config.botName} v${Config.version} | ${Config.developer}`,
    })
    .setTimestamp();

  if (options.title) embed.setTitle(options.title);
  if (options.description) embed.setDescription(options.description);
  if (options.fields) embed.addFields(options.fields);
  if (options.thumbnail) embed.setThumbnail(options.thumbnail);
  if (options.image) embed.setImage(options.image);
  if (options.author) embed.setAuthor(options.author);
  if (options.url) embed.setURL(options.url);

  return embed;
}

/**
 * Success embed
 */
export function successEmbed(description, title = 'Success') {
  return createEmbed({
    title: `${title}`,
    description,
    color: Config.colors.success,
  });
}

/**
 * Error embed
 */
export function errorEmbed(description, title = 'Error') {
  return createEmbed({
    title: `${title}`,
    description,
    color: Config.colors.error,
  });
}

/**
 * Warning embed
 */
export function warningEmbed(description, title = 'Warning') {
  return createEmbed({
    title: `${title}`,
    description,
    color: Config.colors.warning,
  });
}

/**
 * Info embed
 */
export function infoEmbed(description, title = 'Info') {
  return createEmbed({
    title: `${title}`,
    description,
    color: Config.colors.info,
  });
}

/**
 * Moderation action embed
 */
export function modEmbed(action, target, moderator, reason) {
  return createEmbed({
    title: `Moderation: ${action}`,
    color: Config.colors.moderation,
    fields: [
      { name: 'Target', value: `${target}`, inline: true },
      { name: 'Moderator', value: `${moderator}`, inline: true },
      { name: 'Reason', value: reason || 'No reason provided', inline: false },
    ],
  });
}
