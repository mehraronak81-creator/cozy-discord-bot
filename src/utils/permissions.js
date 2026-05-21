// ==========================================
//  Cozy Bot - Permission Utilities
//  Made by Void&Co Development
// ==========================================

import { PermissionFlagsBits } from 'discord.js';

/**
 * Check if a member has a higher role than a target member
 */
export function isHigherRole(member, target) {
  if (!member || !target) return false;
  if (member.id === member.guild.ownerId) return true;
  if (target.id === target.guild.ownerId) return false;
  return member.roles.highest.position > target.roles.highest.position;
}

/**
 * Check if the bot can moderate a target member
 */
export function canModerate(botMember, targetMember) {
  if (!botMember || !targetMember) return false;
  if (targetMember.id === targetMember.guild.ownerId) return false;
  return botMember.roles.highest.position > targetMember.roles.highest.position;
}

/**
 * Check if a member is a moderator (has Manage Messages or higher)
 */
export function isModerator(member) {
  return (
    member.permissions.has(PermissionFlagsBits.ManageMessages) ||
    member.permissions.has(PermissionFlagsBits.ManageGuild) ||
    member.permissions.has(PermissionFlagsBits.Administrator) ||
    member.id === member.guild.ownerId
  );
}

/**
 * Check if a member is an admin
 */
export function isAdmin(member) {
  return (
    member.permissions.has(PermissionFlagsBits.Administrator) ||
    member.id === member.guild.ownerId
  );
}

/**
 * Format a permission name to be human readable
 */
export function formatPermission(perm) {
  return perm
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
