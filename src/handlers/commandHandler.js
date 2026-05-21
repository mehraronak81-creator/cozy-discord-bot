// ==========================================
//  Cozy Bot - Command Handler
//  Made by Void&Co Development
// ==========================================

import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Load all commands from the commands directory
 */
export async function loadCommands(client) {
  client.commands = new Collection();
  client.cooldowns = new Collection();

  const commandsPath = join(__dirname, '..', 'commands');
  const categories = readdirSync(commandsPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let totalLoaded = 0;

  for (const category of categories) {
    const categoryPath = join(commandsPath, category);
    const commandFiles = readdirSync(categoryPath).filter((f) => f.endsWith('.js'));

    for (const file of commandFiles) {
      try {
        const command = await import(`../commands/${category}/${file}`);
        const cmd = command.default || command;

        if (!cmd.data || !cmd.execute) {
          logger.warn(`Command ${file} is missing "data" or "execute" - skipping`);
          continue;
        }

        cmd.category = category;
        client.commands.set(cmd.data.name, cmd);
        totalLoaded++;
      } catch (err) {
        logger.error(`Failed to load command ${file}`, err);
      }
    }
  }

  logger.success(`Loaded ${totalLoaded} commands across ${categories.length} categories`);
  return client.commands;
}

/**
 * Get all command data for deployment
 */
export async function getCommandData(client) {
  if (!client.commands || client.commands.size === 0) {
    await loadCommands(client);
  }
  return client.commands.map((cmd) => cmd.data.toJSON());
}
