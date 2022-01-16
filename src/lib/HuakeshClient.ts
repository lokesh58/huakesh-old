import { Client, ClientEvents, ClientOptions, Collection, Snowflake, User } from 'discord.js';
import { commands as allCommands } from '../commands';
import { events as allEvents } from '../events';
import { Command } from './commands';
import { EntityLoadError, LoadErrors } from './errors';
import { ClientEvent, Events } from './events';
import { Logger } from './logs';
import { Entities } from './types';
import { processError } from './utils';

/**
 * Constructs the message to log after successful loading of an entity.
 * @param entity The entity which was loaded
 * @param entityName The name of the entity
 * @returns The successful loading message
 */
const successfulLoadMessage = (entity: Entities, entityType: string, entityName: string): string =>
  `${entity} (${entityType}) ${entityName} loaded.`;

/**
 * Constructs the message to log after successfully started listening to events.
 * @param eventType The type of event being listened
 * @param once Whether these events are handled only once
 * @returns The successfully started listening message
 */
const startedListeningToEventMessage = (eventType: Events, once: boolean): string =>
  `Started listening for ${once ? 'one time' : 'recurring'} event(s) of type ${eventType}.`;

declare module 'discord.js' {
  interface Client {
    /**
     * The collection of Commands loaded in this client
     */
    commands: Collection<string, Command>;

    /**
     * The collection of owners of this bot's application
     */
    owners: Collection<Snowflake, User>;

    /**
     * The threshold for number of commands to create/update/delete after which all application commands are overwritten
     */
    commandRegistrationOverwriteThreshold: number;
  }

  interface ClientOptions {
    /**
     * The threshold for number of commands to create/update/delete after which all application commands are overwritten
     * Default: 5
     */
    commandRegistrationOverwriteThreshold?: number;
  }
}

class EventTypeToEventsCollection extends Collection<Events, ClientEvent[]> {}

export class HuakeshClient<Ready extends boolean = boolean> extends Client<Ready> {
  /**
   * @param options The client options
   */
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
    this.commandRegistrationOverwriteThreshold = options.commandRegistrationOverwriteThreshold ?? 5;
  }

  public get owners(): Collection<string, User> {
    if (!this.isReady() || !this.application.owner) return new Collection();
    const {
      application: { owner: ownerOrTeam },
    } = this;
    if (ownerOrTeam instanceof User) {
      return new Collection([[ownerOrTeam.id, ownerOrTeam]]);
    } else {
      return ownerOrTeam.members.filter((m) => m.membershipState === 'ACCEPTED').mapValues((m) => m.user);
    }
  }

  /**
   * Does the initial setup of the client, then logs in to establish websocket connection to Discord.
   * @param token The account token to use to log in the client
   * @returns The token used to log in the client
   */
  public async login(token?: string): Promise<string> {
    await this.initialSetup();
    return super.login(token);
  }

  /**
   * Loads the commands and events, then starts listening for all events.
   */
  private async initialSetup() {
    this.loadCommands();
    this.loadEvents();
  }

  /**
   * Loads the commands to client
   */
  private loadCommands() {
    this.emit('debug', 'Loading Commands.');
    allCommands.forEach((command) => {
      const {
        data: { name },
        type,
      } = command;
      if (this.commands.has(name)) {
        throw new EntityLoadError(Entities.COMMAND, name, LoadErrors.DUPLICATE);
      }
      this.commands.set(name, command);
      Logger.info(successfulLoadMessage(Entities.COMMAND, type, name));
    }, this);
  }

  /**
   * Loads and then starts listening to the events.
   */
  private loadEvents() {
    this.emit('debug', 'Loading Events.');
    const eventTypeToOnceEvents = new EventTypeToEventsCollection();
    const eventTypeToRecurringEvents = new EventTypeToEventsCollection();
    const eventDuplicateCheck: { [key: string]: boolean } = {};
    allEvents.forEach((_event) => {
      if (!(_event instanceof ClientEvent)) return;
      const event = _event as ClientEvent;
      const { name, type } = event;
      if (eventDuplicateCheck[name]) {
        throw new EntityLoadError(Entities.EVENT, name, LoadErrors.DUPLICATE);
      }
      const eventTypeToEvents = event.once ? eventTypeToOnceEvents : eventTypeToRecurringEvents;
      const events = eventTypeToEvents.get(type);
      if (events) {
        events.push(event);
      } else {
        eventTypeToEvents.set(type, [event]);
      }
      eventDuplicateCheck[name] = true;
      Logger.info(successfulLoadMessage(Entities.EVENT, type, name));
    });

    // Start Listening for Events
    this.emit('debug', 'Starting listeners for one time events.');
    this.startListeningToEvents(eventTypeToOnceEvents, true);

    this.emit('debug', 'Starting listeners for recurring events.');
    this.startListeningToEvents(eventTypeToRecurringEvents, false);
  }

  /**
   * Starts listening for events
   * @param eventTypeToEvents Collection mapping event type to array of events
   * @param once Whether these events are handled only once
   */
  private startListeningToEvents(eventTypeToEvents: EventTypeToEventsCollection, once: boolean): void {
    eventTypeToEvents.forEach((events, eventType) => {
      const cb = async (...args: ClientEvents[Events]) => {
        const results = await Promise.allSettled(events.map((event) => event.handler(...args)));
        results.forEach((res) => {
          if (res.status === 'rejected') {
            const { reason } = res;
            const err = processError(reason);
            Logger.log(err.level, err);
          }
        });
      };
      if (once) {
        this.once(eventType, cb);
      } else {
        this.on(eventType, cb);
      }
      Logger.info(startedListeningToEventMessage(eventType, once));
    }, this);
  }
}
