// ==========================================
//  Cozy Bot - Ready Event
//  Made by Void&Co Development
// ==========================================

import { ActivityType } from 'discord.js';
import { logger } from '../utils/logger.js';
import { Config } from '../config.js';

const activities = [
  { name: '/help | Cozy Bot', type: ActivityType.Watching },
  { name: `${Config.developer}`, type: ActivityType.Custom },
  { name: 'over {guilds} servers', type: ActivityType.Watching },
  { name: 'with {members} users', type: ActivityType.Playing },
  { name: '/about | v{version}', type: ActivityType.Listening },
];

export default {
  name: 'ready',
  once: true,
  execute(client) {
    logger.success(`${Config.botName} is online as ${client.user.tag}`);
    logger.info(`Serving ${client.guilds.cache.size} guilds with ${client.users.cache.size} cached users`);
    logger.info(`Support: ${Config.supportServer}`);

    // Rotate activity status
    let index = 0;
    const updateActivity = () => {
      const activity = activities[index % activities.length];
      const name = activity.name
        .replace('{guilds}', client.guilds.cache.size.toString())
        .replace('{members}', client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toString())
        .replace('{version}', Config.version);

      client.user.setPresence({
        activities: [{ name, type: activity.type }],
        status: 'online',
      });
      index++;
    };

    updateActivity();
    setInterval(updateActivity, 30_000);
  },
};
