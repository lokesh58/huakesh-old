import { SlashCommandBuilder } from '@discordjs/builders';
import { commaListsAnd, stripIndent } from 'common-tags';
import { Message, MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../../lib';

export const infoCommand = new SlashCommand({
  data: new SlashCommandBuilder().setName('info').setDescription('Get some info about the bot'),
  handler: async (interaction) => {
    const { client } = interaction;
    const msg = await interaction.deferReply({ fetchReply: true });
    const latency =
      (msg instanceof Message ? msg.createdAt : new Date(msg.timestamp)).getTime() - interaction.createdTimestamp;
    const embed = new MessageEmbed()
      .setTitle(`${client.user?.username}'s Info`)
      .setDescription(
        stripIndent`
          **Owners:** ${commaListsAnd`${client.owners.map((u) => u.tag)}`}
          **Number of Servers:** ${client.guilds.cache.size}
        `,
      )
      .addField(
        'Technical Details',
        stripIndent`
          **Websocket Heartbeat:** ${client.ws.ping}ms
          **Roundtrip Latency:** ${latency}ms
        `,
      );
    await interaction.editReply({ embeds: [embed] });
  },
});
