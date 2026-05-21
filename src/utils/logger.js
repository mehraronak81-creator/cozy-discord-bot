// ==========================================
//  Cozy Bot - Logger Utility
//  Made by Void&Co Development
// ==========================================

const LEVELS = {
  ERROR: '\x1b[31m[ERROR]\x1b[0m',
  WARN: '\x1b[33m[WARN]\x1b[0m',
  INFO: '\x1b[36m[INFO]\x1b[0m',
  DEBUG: '\x1b[35m[DEBUG]\x1b[0m',
  SUCCESS: '\x1b[32m[OK]\x1b[0m',
  COMMAND: '\x1b[34m[CMD]\x1b[0m',
};

function timestamp() {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

export const logger = {
  info: (msg) => console.log(`${timestamp()} ${LEVELS.INFO} ${msg}`),
  warn: (msg) => console.log(`${timestamp()} ${LEVELS.WARN} ${msg}`),
  error: (msg, err) => {
    console.log(`${timestamp()} ${LEVELS.ERROR} ${msg}`);
    if (err) console.error(err);
  },
  debug: (msg) => {
    if (process.env.DEBUG === 'true') {
      console.log(`${timestamp()} ${LEVELS.DEBUG} ${msg}`);
    }
  },
  success: (msg) => console.log(`${timestamp()} ${LEVELS.SUCCESS} ${msg}`),
  command: (user, cmd, guild) =>
    console.log(`${timestamp()} ${LEVELS.COMMAND} ${user} used /${cmd} in ${guild}`),
};
