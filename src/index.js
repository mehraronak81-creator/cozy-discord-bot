// ==========================================
//
//   ██████╗ ██████╗ ███████╗██╗   ██╗
//  ██╔════╝██╔═══██╗╚══███╔╝╚██╗ ██╔╝
//  ██║     ██║   ██║  ███╔╝  ╚████╔╝
//  ██║     ██║   ██║ ███╔╝    ╚██╔╝
//  ╚██████╗╚██████╔╝███████╗   ██║
//   ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝
//
//  Cozy Bot v2.0.0
//  Made by Void&Co Development
//  https://discord.gg/KE6habwtZU
//
// ==========================================

import 'dotenv/config';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { loadCommands } from './handlers/commandHandler.js';
import { loadEvents } from './handlers/eventHandler.js';
import { logger } from './utils/logger.js';
import { Config } from './config.js';
import { getDueReminders, deleteReminder } from './utils/database.js';

// ==========================================
//  Client Setup
// ==========================================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildMember,
  ],
});

// ==========================================
//  Initialization
// ==========================================

logger.info(`Starting ${Config.botName} v${Config.version}...`);
logger.info(`Made by ${Config.developer}`);

// Load commands and events
await loadCommands(client);
await loadEvents(client);

// ==========================================
//  Reminder Check Interval
// ==========================================

setInterval(async () => {
  try {
    const dueReminders = getDueReminders();
    for (const reminder of dueReminders) {
      try {
        const channel = await client.channels.fetch(reminder.channel_id).catch(() => null);
        if (channel) {
          await channel.send({
            content: `<@${reminder.user_id}> -- **Reminder:** ${reminder.message}`,
          });
        }
        deleteReminder(reminder.id);
      } catch {
        deleteReminder(reminder.id);
      }
    }
  } catch {
    // Silently handle reminder check errors
  }
}, 30_000); // Check every 30 seconds

// ==========================================
//  Error Handling
// ==========================================

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
});

// ==========================================
//  Login
// ==========================================

const token = process.env.DISCORD_TOKEN;

if (!token) {
  logger.error('DISCORD_TOKEN is not set in .env file. Bot cannot start.');
  logger.info('Copy .env.example to .env and fill in your bot token.');
  process.exit(1);
}

client.login(token).catch((err) => {
  logger.error('Failed to login:', err);
  process.exit(1);
});
