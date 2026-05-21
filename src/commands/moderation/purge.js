// ==========================================
//  Cozy Bot - Purge Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages from a channel')
    .addIntegerOption((o) =>
      o.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)
    )
    .addUserOption((o) => o.setName('user').setDescription('Only delete messages from this user'))
    .addStringOption((o) =>
      o.setName('filter').setDescription('Filter messages').addChoices(
        { name: 'Bots only', value: 'bots' },
        { name: 'Humans only', value: 'humans' },
        { name: 'Contains links', value: 'links' },
        { name: 'Contains attachments', value: 'attachments' }
      )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const targetUser = interaction.options.getUser('user');
    const filter = interaction.options.getString('filter');

    await interaction.deferReply({ ephemeral: true });

    try {
      let messages = await interaction.channel.messages.fetch({ limit: amount });

      // Apply filters
      if (targetUser) {
        messages = messages.filter((m) => m.author.id === targetUser.id);
      }

      if (filter === 'bots') {
        messages = messages.filter((m) => m.author.bot);
      } else if (filter === 'humans') {
        messages = messages.filter((m) => !m.author.bot);
      } else if (filter === 'links') {
        messages = messages.filter((m) => /https?:\/\/\S+/.test(m.content));
      } else if (filter === 'attachments') {
        messages = messages.filter((m) => m.attachments.size > 0);
      }

      // Filter out messages older than 14 days (Discord limitation)
      const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
      messages = messages.filter((m) => m.createdTimestamp > twoWeeksAgo);

      if (messages.size === 0) {
        return interaction.editReply({
          embeds: [errorEmbed('No messages found matching your criteria.')],
        });
      }

      const deleted = await interaction.channel.bulkDelete(messages, true);

      await interaction.editReply({
        embeds: [
          successEmbed(
            `Successfully deleted **${deleted.size}** messages.${
              targetUser ? `\nFiltered by: ${targetUser.tag}` : ''
            }${filter ? `\nFilter: ${filter}` : ''}`,
            'Messages Purged'
          ),
        ],
      });
    } catch (err) {
      await interaction.editReply({
        embeds: [errorEmbed(`Failed to purge messages: ${err.message}`)],
      });
    }
  },
};
