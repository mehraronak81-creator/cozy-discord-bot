// ==========================================
//  Cozy Bot - SQLite Database Manager
//  Made by Void&Co Development
// ==========================================

import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', '..', 'data');

// Ensure data directory exists
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, 'cozy.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// ==========================================
//  Schema Initialization
// ==========================================

db.exec(`
  CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,
    welcome_channel TEXT,
    goodbye_channel TEXT,
    log_channel TEXT,
    mod_log_channel TEXT,
    ticket_category TEXT,
    ticket_log_channel TEXT,
    suggestion_channel TEXT,
    auto_role TEXT,
    welcome_message TEXT DEFAULT 'Welcome to the server, {user}!',
    goodbye_message TEXT DEFAULT 'Goodbye, {user}. We will miss you!',
    welcome_enabled INTEGER DEFAULT 0,
    goodbye_enabled INTEGER DEFAULT 0,
    logging_enabled INTEGER DEFAULT 0,
    tickets_enabled INTEGER DEFAULT 0,
    auto_role_enabled INTEGER DEFAULT 0,
    anti_spam_enabled INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS warnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    reason TEXT DEFAULT 'No reason provided',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS mod_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    reason TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    channel_id TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    subject TEXT DEFAULT 'No subject',
    status TEXT DEFAULT 'open',
    created_at TEXT DEFAULT (datetime('now')),
    closed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    message_id TEXT,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    response TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    guild_id TEXT,
    message TEXT NOT NULL,
    remind_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_warnings_guild ON warnings(guild_id);
  CREATE INDEX IF NOT EXISTS idx_warnings_user ON warnings(guild_id, user_id);
  CREATE INDEX IF NOT EXISTS idx_mod_logs_guild ON mod_logs(guild_id);
  CREATE INDEX IF NOT EXISTS idx_tickets_guild ON tickets(guild_id);
  CREATE INDEX IF NOT EXISTS idx_suggestions_guild ON suggestions(guild_id);
  CREATE INDEX IF NOT EXISTS idx_reminders_time ON reminders(remind_at);
`);

// ==========================================
//  Guild Settings
// ==========================================

export function getGuildSettings(guildId) {
  let settings = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guildId);
  if (!settings) {
    db.prepare('INSERT OR IGNORE INTO guild_settings (guild_id) VALUES (?)').run(guildId);
    settings = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?').get(guildId);
  }
  return settings;
}

export function updateGuildSetting(guildId, key, value) {
  getGuildSettings(guildId); // ensure row exists
  db.prepare(`UPDATE guild_settings SET ${key} = ? WHERE guild_id = ?`).run(value, guildId);
}

// ==========================================
//  Warnings
// ==========================================

export function addWarning(guildId, userId, moderatorId, reason) {
  return db.prepare(
    'INSERT INTO warnings (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)'
  ).run(guildId, userId, moderatorId, reason);
}

export function getWarnings(guildId, userId) {
  return db.prepare(
    'SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC'
  ).all(guildId, userId);
}

export function clearWarnings(guildId, userId) {
  return db.prepare('DELETE FROM warnings WHERE guild_id = ? AND user_id = ?').run(guildId, userId);
}

export function removeWarning(warningId) {
  return db.prepare('DELETE FROM warnings WHERE id = ?').run(warningId);
}

// ==========================================
//  Mod Logs
// ==========================================

export function addModLog(guildId, action, targetId, moderatorId, reason) {
  return db.prepare(
    'INSERT INTO mod_logs (guild_id, action, target_id, moderator_id, reason) VALUES (?, ?, ?, ?, ?)'
  ).run(guildId, action, targetId, moderatorId, reason);
}

export function getModLogs(guildId, targetId = null, limit = 10) {
  if (targetId) {
    return db.prepare(
      'SELECT * FROM mod_logs WHERE guild_id = ? AND target_id = ? ORDER BY created_at DESC LIMIT ?'
    ).all(guildId, targetId, limit);
  }
  return db.prepare(
    'SELECT * FROM mod_logs WHERE guild_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(guildId, limit);
}

// ==========================================
//  Tickets
// ==========================================

export function createTicket(guildId, channelId, userId, subject) {
  return db.prepare(
    'INSERT INTO tickets (guild_id, channel_id, user_id, subject) VALUES (?, ?, ?, ?)'
  ).run(guildId, channelId, userId, subject);
}

export function getTicket(channelId) {
  return db.prepare('SELECT * FROM tickets WHERE channel_id = ?').get(channelId);
}

export function closeTicket(channelId) {
  return db.prepare(
    "UPDATE tickets SET status = 'closed', closed_at = datetime('now') WHERE channel_id = ?"
  ).run(channelId);
}

export function getOpenTickets(guildId, userId = null) {
  if (userId) {
    return db.prepare(
      "SELECT * FROM tickets WHERE guild_id = ? AND user_id = ? AND status = 'open'"
    ).all(guildId, userId);
  }
  return db.prepare(
    "SELECT * FROM tickets WHERE guild_id = ? AND status = 'open'"
  ).all(guildId);
}

// ==========================================
//  Suggestions
// ==========================================

export function addSuggestion(guildId, messageId, userId, content) {
  return db.prepare(
    'INSERT INTO suggestions (guild_id, message_id, user_id, content) VALUES (?, ?, ?, ?)'
  ).run(guildId, messageId, userId, content);
}

export function getSuggestion(id) {
  return db.prepare('SELECT * FROM suggestions WHERE id = ?').get(id);
}

export function updateSuggestionStatus(id, status, response = null) {
  return db.prepare(
    'UPDATE suggestions SET status = ?, response = ? WHERE id = ?'
  ).run(status, response, id);
}

// ==========================================
//  Reminders
// ==========================================

export function addReminder(userId, channelId, guildId, message, remindAt) {
  return db.prepare(
    'INSERT INTO reminders (user_id, channel_id, guild_id, message, remind_at) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, channelId, guildId, message, remindAt);
}

export function getDueReminders() {
  return db.prepare(
    "SELECT * FROM reminders WHERE remind_at <= datetime('now')"
  ).all();
}

export function deleteReminder(id) {
  return db.prepare('DELETE FROM reminders WHERE id = ?').run(id);
}

export function getUserReminders(userId) {
  return db.prepare(
    'SELECT * FROM reminders WHERE user_id = ? ORDER BY remind_at ASC'
  ).all(userId);
}

export default db;
