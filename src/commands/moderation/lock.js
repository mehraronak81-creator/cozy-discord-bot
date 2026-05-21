// ==========================================
//  Cozy Bot - Lock/Unlock Channel Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed, errorEmbed } from '../../utils/embed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock or unlock a channel')
    .addSubcommand((sub) =>
      sub
        .setName('on')
        .setDescription('Lock the channel (prevent members from sending messages)')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel to lock (default: current)'))
        .addStringOption((o) => o.setName('reason').setDescription('Reason for locking'))
    )
    .addSubcommand((sub) =>
      sub
        .setName('off')
        .setDescription('Unlock the channel')
        .addChannelOption((o) => o.setName('channel').setDescription('Channel to unlock (default: current)'))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      if (sub === 'on') {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: false,
          AddReactions: false,
        });

        await interaction.reply({
          embeds: [
            successEmbed(
              `<#${channel.id}> has been **locked**.\n**Reason:** ${reason}`,
              'Channel Locked'
            ),
          ],
        });
      } else {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
          SendMessages: null,
          AddReactions: null,
        });

        await interaction.reply({
          embeds: [successEmbed(`<#${channel.id}> has been **unlocked**.`, 'Channel Unlocked')],
        });
      }
    } catch (err) {
      await interaction.reply({
        embeds: [errorEmbed(`Failed to modify channel: ${err.message}`)],
        ephemeral: true,
      });
    }
  },
};
