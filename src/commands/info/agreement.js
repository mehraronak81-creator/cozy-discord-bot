// ==========================================
//  Cozy Bot - Agreement / Terms of Service
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('agreement')
    .setDescription('View the Cozy terms of service and user agreement'),

  async execute(interaction) {
    const embed = createEmbed({
      title: `${Config.botName} - Terms of Service`,
      description: [
        `**Void&Co Development -- Terms of Service**`,
        `*Last updated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*`,
        '',
        `By using **${Config.botName}**, you agree to the following terms:`,
        '',
        '**1. Acceptance**',
        `By adding ${Config.botName} to your server or interacting with its commands, you agree to these terms. If you do not agree, remove the bot from your server immediately.`,
        '',
        '**2. Proper Use**',
        '- Use the bot only for its intended purpose within Discord.',
        '- Do not use the bot to harass, abuse, spam, or violate Discord Terms of Service.',
        '- Do not attempt to exploit, overload, or attack the bot or its infrastructure.',
        '',
        '**3. Data Collection**',
        `${Config.botName} may store server IDs, user IDs, and configuration settings to provide its services. We do not sell or share personal data. Data is stored locally and securely.`,
        '',
        '**4. Availability**',
        'We aim for maximum uptime but do not guarantee uninterrupted service. The bot may be taken offline for updates, maintenance, or at our discretion.',
        '',
        '**5. Moderation Actions**',
        `Actions taken by ${Config.botName} (bans, kicks, warnings, etc.) are executed by server moderators through the bot. Void&Co Development is not responsible for how server staff use moderation features.`,
        '',
        '**6. Limitation of Liability**',
        'Void&Co Development is not liable for any loss, damage, or issues that arise from the use of this bot.',
        '',
        '**7. Changes**',
        'These terms may be updated at any time. Continued use of the bot constitutes acceptance of any changes.',
        '',
        `Questions? Join our [Support Server](${Config.supportServer}).`,
      ].join('\n'),
      color: Config.colors.neutral,
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
