import { MessageEmbed } from 'discord.js';
import { HuakeshError, UnexpectedError } from './errors';

export const processError = (error: unknown) => (error instanceof HuakeshError ? error : new UnexpectedError(error));

export const getErrorEmbed = (errorMsg: string) => new MessageEmbed().setDescription(errorMsg).setColor('RED');
