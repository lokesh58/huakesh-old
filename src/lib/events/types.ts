import { Awaitable, ClientEvents } from 'discord.js';

export type Events = keyof ClientEvents;

export type EventHandler<EventType extends Events = Events> = (...args: ClientEvents[EventType]) => Awaitable<void>;
