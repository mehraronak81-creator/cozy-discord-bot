// ==========================================
//  Cozy Bot - Remind Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { successEmbed, errorEmbed, createEmbed } from '../../utils/embed.js';
import { addReminder, getUserReminders, deleteReminder } from '../../utils/database.js';
import ms from 'ms';

export default {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set or manage reminders')
    .addSubcommand((sub) =>
      sub
        .setName('set')
        .setDescription('Set a new reminder')
        .addStringOption((o) => o.setName('time').setDescription('When to remind (e.g. 10m, 1h, 1d)').setRequired(true))
        .addStringOption((o) => o.setName('message').setDescription('What to remind you about').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('list').setDescription('View your active reminders')
    )
    .addSubcommand((sub) =>
      sub
        .setName('cancel')
        .setDescription('Cancel a reminder')
        .addIntegerOption((o) => o.setName('id').setDescription('Reminder ID to cancel').setRequired(true))
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const timeStr = interaction.options.getString('time');
      const message = interaction.options.getString('message');

      const duration = ms(timeStr);
      if (!duration || duration < 30000 || duration > 30 * 24 * 60 * 60 * 1000) {
        return interaction.reply({
          embeds: [errorEmbed('Invalid duration. Min: 30s, Max: 30 days. Use formats like `10m`, `1h`, `1d`.')],
          ephemeral: true,
        });
      }

      const remindAt = new Date(Date.now() + duration).toISOString();
      addReminder(interaction.user.id, interaction.channel.id, interaction.guild?.id, message, remindAt);

      await interaction.reply({
        embeds: [
          successEmbed(
            `I will remind you in **${timeStr}** (<t:${Math.floor((Date.now() + duration) / 1000)}:R>)\n**Message:** ${message}`,
            'Reminder Set'
          ),
        ],
        ephemeral: true,
      });
    }

    if (sub === 'list') {
      const reminders = getUserReminders(interaction.user.id);

      if (reminders.length === 0) {
        return interaction.reply({
          embeds: [createEmbed({ title: 'Your Reminders', description: 'You have no active reminders.' })],
          ephemeral: true,
        });
      }

      const list = reminders
        .map(
          (r) =>
            `**#${r.id}** - ${r.message}\nDue: <t:${Math.floor(new Date(r.remind_at).getTime() / 1000)}:R>`
        )
        .join('\n\n');

      await interaction.reply({
        embeds: [createEmbed({ title: 'Your Reminders', description: list })],
        ephemeral: true,
      });
    }

    if (sub === 'cancel') {
      const id = interaction.options.getInteger('id');
      const result = deleteReminder(id);

      if (result.changes === 0) {
        return interaction.reply({
          embeds: [errorEmbed(`Reminder #${id} not found.`)],
          ephemeral: true,
        });
      }

      await interaction.reply({
        embeds: [successEmbed(`Reminder **#${id}** has been cancelled.`, 'Reminder Cancelled')],
        ephemeral: true,
      });
    }
  },
};
