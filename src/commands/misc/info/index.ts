import { SlashCommandBuilder } from '@discordjs/builders';
import { stripIndent } from 'common-tags';
import { Message, MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../../lib';

export const infoCommand = new SlashCommand({
  data: new SlashCommandBuilder().setName('info').setDescription('Get some info about the bot'),
  handler: async (interaction) => {
    const { client } = interaction;
    const getInfoEmbed = (latency?: number) =>
      new MessageEmbed().setTitle(`${client.user?.username}'s Info`).setDescription(stripIndent`
      **Websocket Heartbeat:** ${client.ws.ping}ms
      **Roundtrip latency:** ${typeof latency === 'undefined' ? 'pinging...' : `${latency}ms`}
    `);
    const msg = await interaction.reply({ embeds: [getInfoEmbed()], fetchReply: true });
    const latency =
      (msg instanceof Message ? msg.createdAt : new Date(msg.timestamp)).getTime() - interaction.createdTimestamp;
    await interaction.editReply({ embeds: [getInfoEmbed(latency)] });
  },
});
