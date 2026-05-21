// ==========================================
//  Cozy Bot - Slash Command Deployer
//  Made by Void&Co Development
//
//  Usage:
//    node src/deploy-commands.js          - Deploy globally
//    node src/deploy-commands.js --guild  - Deploy to test guild
//    node src/deploy-commands.js --clear  - Clear all commands
// ==========================================

import 'dotenv/config';
import { REST, Routes, Client } from 'discord.js';
import { loadCommands, getCommandData } from './handlers/commandHandler.js';
import { logger } from './utils/logger.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  logger.error('DISCORD_TOKEN and CLIENT_ID are required in .env');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);
const client = new Client({ intents: [] });

const args = process.argv.slice(2);
const isGuild = args.includes('--guild');
const isClear = args.includes('--clear');

async function deploy() {
  try {
    if (isClear) {
      logger.info('Clearing all commands...');

      if (isGuild && guildId) {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
        logger.success(`Cleared guild commands for ${guildId}`);
      } else {
        await rest.put(Routes.applicationCommands(clientId), { body: [] });
        logger.success('Cleared all global commands');
      }
      return;
    }

    await loadCommands(client);
    const commands = await getCommandData(client);

    logger.info(`Deploying ${commands.length} commands...`);

    if (isGuild) {
      if (!guildId) {
        logger.error('GUILD_ID is required for guild deployment. Set it in .env');
        process.exit(1);
      }

      const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      logger.success(`Deployed ${data.length} commands to guild ${guildId}`);
    } else {
      const data = await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
      logger.success(`Deployed ${data.length} commands globally (may take up to 1 hour to propagate)`);
    }
  } catch (err) {
    logger.error('Failed to deploy commands:', err);
    process.exit(1);
  }
}

deploy();
