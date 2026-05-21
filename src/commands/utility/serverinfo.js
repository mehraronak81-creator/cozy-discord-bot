// ==========================================
//  Cozy Bot - Server Info Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get detailed information about this server'),

  async execute(interaction) {
    const { guild } = interaction;
    await guild.members.fetch().catch(() => {});

    const textChannels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size;
    const voiceChannels = guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size;
    const categories = guild.channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size;
    const threads = guild.channels.cache.filter(
      (c) => c.type === ChannelType.PublicThread || c.type === ChannelType.PrivateThread
    ).size;

    const onlineMembers = guild.members.cache.filter(
      (m) => m.presence?.status && m.presence.status !== 'offline'
    ).size;
    const botCount = guild.members.cache.filter((m) => m.user.bot).size;
    const humanCount = guild.memberCount - botCount;

    const verificationLevels = {
      0: 'None',
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Very High',
    };

    const boostTier = {
      0: 'None',
      1: 'Tier 1',
      2: 'Tier 2',
      3: 'Tier 3',
    };

    const owner = await guild.fetchOwner().catch(() => null);

    const embed = createEmbed({
      title: guild.name,
      color: Config.colors.primary,
      thumbnail: guild.iconURL({ size: 256, dynamic: true }),
      fields: [
        { name: 'Owner', value: owner ? `${owner.user.tag}` : 'Unknown', inline: true },
        { name: 'Server ID', value: guild.id, inline: true },
        {
          name: 'Created',
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>\n(<t:${Math.floor(guild.createdTimestamp / 1000)}:R>)`,
          inline: true,
        },
        {
          name: `Members [${guild.memberCount}]`,
          value: `Humans: ${humanCount}\nBots: ${botCount}\nOnline: ${onlineMembers}`,
          inline: true,
        },
        {
          name: `Channels [${guild.channels.cache.size}]`,
          value: `Text: ${textChannels}\nVoice: ${voiceChannels}\nCategories: ${categories}\nThreads: ${threads}`,
          inline: true,
        },
        {
          name: `Roles [${guild.roles.cache.size - 1}]`,
          value: `Highest: ${guild.roles.highest.name !== '@everyone' ? guild.roles.highest.name : 'None'}`,
          inline: true,
        },
        { name: 'Verification', value: verificationLevels[guild.verificationLevel] || 'Unknown', inline: true },
        {
          name: 'Boost Status',
          value: `${boostTier[guild.premiumTier]} (${guild.premiumSubscriptionCount || 0} boosts)`,
          inline: true,
        },
        {
          name: 'Emojis & Stickers',
          value: `Emojis: ${guild.emojis.cache.size}\nStickers: ${guild.stickers.cache.size}`,
          inline: true,
        },
      ],
    });

    if (guild.bannerURL()) {
      embed.setImage(guild.bannerURL({ size: 512 }));
    }

    await interaction.reply({ embeds: [embed] });
  },
};
