import 'dotenv/config';
import { HuakeshClient } from './lib';

const client = new HuakeshClient({
  intents: [],
});

client.login(process.env.BOT_TOKEN);
