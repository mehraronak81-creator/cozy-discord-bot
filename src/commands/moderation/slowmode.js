// ==========================================
//  Cozy Bot - Slowmode Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode for the current channel')
    .addIntegerOption((o) =>
      o.setName('seconds').setDescription('Slowmode in seconds (0 to disable)').setRequired(true).setMinValue(0).setMaxValue(21600)
    )
    .addStringOption((o) => o.setName('reason').setDescription('Reason for setting slowmode'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await interaction.channel.setRateLimitPerUser(seconds, reason);

      if (seconds === 0) {
        await interaction.reply({
          embeds: [successEmbed('Slowmode has been **disabled** for this channel.', 'Slowmode Off')],
        });
      } else {
        const formatted =
          seconds >= 3600
            ? `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
            : seconds >= 60
            ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
            : `${seconds}s`;

        await interaction.reply({
          embeds: [successEmbed(`Slowmode set to **${formatted}** for this channel.`, 'Slowmode Set')],
        });
      }
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`Failed to set slowmode: ${err.message}`)],
        ephemeral: true,
      });
    }
  },
};
