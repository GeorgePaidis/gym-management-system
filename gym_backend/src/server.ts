import { connectDB } from './utils/db';
import app from './app';

const port = process.env.PORT || 3000;

const start = async () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
    console.error('Fatal: JWT_SECRET is missing or empty. Set it in .env');
    process.exit(1);
  }
  await connectDB();
  app.listen(port, () => {
    console.log("Server is up on port:", port);
  });
};

start();