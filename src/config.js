// ==========================================
//  Cozy Bot - Configuration
//  Made by Void&Co Development
//  https://discord.gg/KE6habwtZU
// ==========================================

export const Config = {
  // Branding
  botName: 'Cozy',
  version: '2.0.0',
  developer: 'Void&Co Development',
  supportServer: 'https://discord.gg/KE6habwtZU',
  website: 'https://discord.gg/KE6habwtZU',

  // Embed colors (hex)
  colors: {
    primary: 0x5865F2,    // Blurple
    success: 0x57F287,    // Green
    warning: 0xFEE75C,    // Yellow
    error: 0xED4245,      // Red
    info: 0x5865F2,       // Blurple
    moderation: 0xEB459E, // Fuchsia
    neutral: 0x2F3136,    // Dark embed
  },

  // Default settings for new guilds
  defaults: {
    prefix: '!',
    language: 'en',
    welcomeEnabled: false,
    goodbyeEnabled: false,
    loggingEnabled: false,
    ticketsEnabled: false,
    autoRoleEnabled: false,
    antiSpamEnabled: false,
  },

  // Limits
  limits: {
    maxWarnings: 5,
    maxPurge: 100,
    maxTickets: 50,
    slowmodeMax: 21600,
    pollMaxOptions: 10,
    reasonMaxLength: 512,
  },

  // Cooldowns (in seconds)
  cooldowns: {
    default: 3,
    moderation: 5,
    fun: 5,
    utility: 3,
  },
};
