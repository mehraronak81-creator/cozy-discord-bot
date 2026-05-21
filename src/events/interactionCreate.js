// ==========================================
//  Cozy Bot - Interaction Create Event
//  Made by Void&Co Development
// ==========================================

import { Collection } from 'discord.js';
import { logger } from '../utils/logger.js';
import { errorEmbed } from '../utils/embed.js';
import { Config } from '../config.js';

export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Cooldown check
      const { cooldowns } = client;
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      const cooldownMs =
        (command.cooldown || Config.cooldowns[command.category] || Config.cooldowns.default) * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expiry = timestamps.get(interaction.user.id) + cooldownMs;
        if (now < expiry) {
          const remaining = ((expiry - now) / 1000).toFixed(1);
          return interaction.reply({
            embeds: [
              errorEmbed(
                `Please wait **${remaining}s** before using \`/${command.data.name}\` again.`,
                'Cooldown Active'
              ),
            ],
            ephemeral: true,
          });
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownMs);

      // Execute command
      try {
        logger.command(
          interaction.user.tag,
          interaction.commandName,
          interaction.guild?.name || 'DM'
        );
        await command.execute(interaction, client);
      } catch (err) {
        logger.error(`Error executing /${interaction.commandName}`, err);

        const reply = {
          embeds: [
            errorEmbed(
              'An unexpected error occurred while executing this command.\nPlease try again or contact support.',
              'Command Error'
            ),
          ],
          ephemeral: true,
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply).catch(() => {});
        } else {
          await interaction.reply(reply).catch(() => {});
        }
      }
    }

    // Handle autocomplete
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (command?.autocomplete) {
        try {
          await command.autocomplete(interaction, client);
        } catch {
          // Silently fail autocomplete
        }
      }
    }

    // Handle buttons
    if (interaction.isButton()) {
      // Ticket close button
      if (interaction.customId === 'ticket_close') {
        const ticketCmd = client.commands.get('ticket');
        if (ticketCmd?.handleButton) {
          await ticketCmd.handleButton(interaction, client);
        }
      }

      // Suggestion buttons
      if (interaction.customId.startsWith('suggestion_')) {
        const suggestCmd = client.commands.get('suggest');
        if (suggestCmd?.handleButton) {
          await suggestCmd.handleButton(interaction, client);
        }
      }
    }
  },
};
