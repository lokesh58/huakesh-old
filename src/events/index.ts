import { autocompleteHandler, contextMenuCommandHandler, slashCommandHandler } from './core/commandHandlers';
import { postLoginHooks } from './core/postLoginHooks';

export const events = [postLoginHooks, slashCommandHandler, autocompleteHandler, contextMenuCommandHandler];
