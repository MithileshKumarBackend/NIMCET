import { createApp } from './app.js';
import { connectDb } from './configs/db.js';
import { env } from './configs/env.js';
const app = createApp();
connectDb().then(() => app.listen(env.port, () => console.log(`[api] listening on ${env.port}`))).catch((err) => { console.error(err); process.exit(1); });
