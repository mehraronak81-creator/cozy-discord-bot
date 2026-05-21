// ==========================================
//  Cozy Bot - Rock Paper Scissors Command
//  Made by Void&Co Development
// ==========================================

import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embed.js';
import { Config } from '../../config.js';

const choices = ['rock', 'paper', 'scissors'];
const beats = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

export default {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Play Rock Paper Scissors against the bot')
    .addStringOption((o) =>
      o
        .setName('choice')
        .setDescription('Your choice')
        .setRequired(true)
        .addChoices(
          { name: 'Rock', value: 'rock' },
          { name: 'Paper', value: 'paper' },
          { name: 'Scissors', value: 'scissors' }
        )
    ),

  async execute(interaction) {
    const userChoice = interaction.options.getString('choice');
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result;
    let color;

    if (userChoice === botChoice) {
      result = "It's a tie!";
      color = Config.colors.warning;
    } else if (beats[userChoice] === botChoice) {
      result = 'You win!';
      color = Config.colors.success;
    } else {
      result = 'I win!';
      color = Config.colors.error;
    }

    const embed = createEmbed({
      title: 'Rock Paper Scissors',
      color,
      fields: [
        { name: 'Your Choice', value: userChoice.charAt(0).toUpperCase() + userChoice.slice(1), inline: true },
        { name: 'My Choice', value: botChoice.charAt(0).toUpperCase() + botChoice.slice(1), inline: true },
        { name: 'Result', value: `**${result}**`, inline: false },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
