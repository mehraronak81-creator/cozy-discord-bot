// ==========================================
//  Cozy Bot - Help Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

const categoryDescriptions = {
  moderation: 'Server moderation and management tools',
  utility: 'Useful utility commands for everyday use',
  fun: 'Fun and entertainment commands',
  info: 'Bot information and documentation',
  tickets: 'Support ticket management system',
  config: 'Server configuration and setup',
};

const categoryLabels = {
  moderation: 'Moderation',
  utility: 'Utility',
  fun: 'Fun',
  info: 'Information',
  tickets: 'Tickets',
  config: 'Configuration',
};

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View all available commands')
    .addStringOption((o) =>
      o.setName('command').setDescription('Get detailed help for a specific command')
    ),

  async execute(interaction, client) {
    const specificCommand = interaction.options.getString('command');

    // Specific command help
    if (specificCommand) {
      const cmd = client.commands.get(specificCommand.toLowerCase());
      if (!cmd) {
        return interaction.reply({
          content: `Command \`${specificCommand}\` not found. Use \`/help\` to see all commands.`,
          ephemeral: true,
        });
      }

      const embed = createEmbed({
        title: `Command: /${cmd.data.name}`,
        description: cmd.data.description,
        color: Config.colors.info,
        fields: [
          { name: 'Category', value: categoryLabels[cmd.category] || cmd.category, inline: true },
          {
            name: 'Cooldown',
            value: `${cmd.cooldown || Config.cooldowns[cmd.category] || Config.cooldowns.default}s`,
            inline: true,
          },
        ],
      });

      // Show subcommands if any
      const subcommands = cmd.data.options?.filter((o) => o.toJSON().type === 1);
      if (subcommands?.length > 0) {
        embed.addFields({
          name: 'Subcommands',
          value: subcommands.map((s) => `\`/${cmd.data.name} ${s.toJSON().name}\` - ${s.toJSON().description}`).join('\n'),
          inline: false,
        });
      }

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Full help menu
    const categories = {};
    client.commands.forEach((cmd) => {
      const cat = cmd.category || 'other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd);
    });

    const embed = createEmbed({
      title: `${Config.botName} - Command List`,
      description: [
        `Welcome to **${Config.botName}**! Here are all available commands.`,
        `Use \`/help <command>\` for detailed info on a specific command.`,
        '',
        `**Total Commands:** ${client.commands.size}`,
        `**Support:** [Void&Co Server](${Config.supportServer})`,
      ].join('\n'),
      color: Config.colors.primary,
      thumbnail: client.user.displayAvatarURL({ size: 128 }),
    });

    for (const [cat, commands] of Object.entries(categories).sort()) {
      const label = categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
      const cmdList = commands
        .sort((a, b) => a.data.name.localeCompare(b.data.name))
        .map((c) => `\`/${c.data.name}\``)
        .join(', ');

      embed.addFields({
        name: `${label} [${commands.length}]`,
        value: cmdList,
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
