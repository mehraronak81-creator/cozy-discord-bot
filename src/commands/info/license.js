// ==========================================
//  Cozy Bot - License Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('license')
    .setDescription('View the Cozy bot license and terms of use'),

  async execute(interaction) {
    const embed = createEmbed({
      title: `${Config.botName} - License`,
      description: [
        '**Void&Co Development -- Proprietary Software License**',
        '',
        `Copyright (c) 2024-${new Date().getFullYear()} Void&Co Development. All rights reserved.`,
        '',
        '**1. Grant of Use**',
        `You are granted a non-exclusive, non-transferable license to use ${Config.botName} within Discord servers. This license does not grant ownership of the software.`,
        '',
        '**2. Restrictions**',
        '- You may NOT redistribute, modify, reverse-engineer, decompile, or create derivative works of this software.',
        '- You may NOT claim this software as your own or remove any branding, credits, or attributions.',
        '- You may NOT sell, sublicense, or commercially exploit this software without explicit written permission from Void&Co Development.',
        '',
        '**3. Intellectual Property**',
        'All code, designs, assets, and associated materials are the exclusive intellectual property of Void&Co Development.',
        '',
        '**4. Disclaimer**',
        'This software is provided "as is" without warranty of any kind. Void&Co Development is not liable for any damages arising from the use of this software.',
        '',
        '**5. Termination**',
        'This license may be revoked at any time if you violate any of the above terms.',
        '',
        `For questions, contact us at our [Support Server](${Config.supportServer}).`,
      ].join('\n'),
      color: Config.colors.neutral,
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
