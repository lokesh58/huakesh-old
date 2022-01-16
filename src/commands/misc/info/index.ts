import { SlashCommandBuilder } from '@discordjs/builders';
import { stripIndent } from 'common-tags';
import { Message, MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../../lib';

export const infoCommand = new SlashCommand({
  data: new SlashCommandBuilder().setName('info').setDescription('Get some info about the bot'),
  handler: async (interaction) => {
    const msg = await interaction.reply({ content: 'Loading...', fetchReply: true });
    const latency =
      (msg instanceof Message ? msg.createdAt : new Date(msg.timestamp)).getTime() - interaction.createdTimestamp;
    const embed = new MessageEmbed().setTitle('Info').setDescription(stripIndent`
      **Websocket heartbeat:** ${interaction.client.ws.ping}ms
      **Roundtrip latency:** ${latency}ms
    `);
    await interaction.editReply({ content: null, embeds: [embed] });
  },
});
