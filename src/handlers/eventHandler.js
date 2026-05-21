// ==========================================
//  Cozy Bot - Event Handler
//  Made by Void&Co Development
// ==========================================

import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Load all events from the events directory
 */
export async function loadEvents(client) {
  const eventsPath = join(__dirname, '..', 'events');
  const eventFiles = readdirSync(eventsPath).filter((f) => f.endsWith('.js'));

  let totalLoaded = 0;

  for (const file of eventFiles) {
    try {
      const event = await import(`../events/${file}`);
      const evt = event.default || event;

      if (!evt.name || !evt.execute) {
        logger.warn(`Event ${file} is missing "name" or "execute" - skipping`);
        continue;
      }

      if (evt.once) {
        client.once(evt.name, (...args) => evt.execute(...args, client));
      } else {
        client.on(evt.name, (...args) => evt.execute(...args, client));
      }

      totalLoaded++;
    } catch (err) {
      logger.error(`Failed to load event ${file}`, err);
    }
  }

  logger.success(`Loaded ${totalLoaded} events`);
}
