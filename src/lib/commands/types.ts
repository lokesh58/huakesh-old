import { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { Awaitable, CacheType, CommandInteraction, ContextMenuInteraction, Interaction } from 'discord.js';

export type InteractionHandler<T extends Interaction = Interaction> = (interaction: T) => Awaitable<void>;

export type CommandDataType = SlashCommandBuilder | ContextMenuCommandBuilder;

export type CommandInteractionHandlerType<Cached extends CacheType = CacheType> =
  | InteractionHandler<CommandInteraction<Cached>>
  | InteractionHandler<ContextMenuInteraction<Cached>>;
