import app from './app.js';
import { connectMongo } from './db/index.js';

const PORT = process.env.PORT || 4000;

connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
});


