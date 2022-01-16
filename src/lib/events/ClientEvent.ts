import { EventHandler, Events } from './types';

/**
 * Interface for client event handler details
 */
export interface ClientEventDetails<EventType extends Events = Events> {
  /**
   * The name of this event
   */
  readonly name: string;

  /**
   * The type of this event
   */
  readonly type: EventType;

  /**
   * Whether this event is handled only once
   */
  readonly once?: boolean;

  /**
   * The handler for this event
   */
  readonly handler: EventHandler<EventType>;
}

/**
 * Class for client event handlers
 */
export class ClientEvent<EventType extends Events = Events> implements ClientEventDetails<EventType> {
  public readonly name: string;
  public readonly type: EventType;
  public readonly once: boolean;
  public readonly handler: EventHandler<EventType>;

  /**
   * @param details The details of this event
   */
  constructor(details: ClientEventDetails<EventType>) {
    const { name, type, once, handler } = details;
    this.name = name;
    this.type = type;
    this.once = once ?? false;
    this.handler = handler;
  }
}
