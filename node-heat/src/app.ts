import 'dotenv/config';
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import { router } from './router';

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (client) => {
  console.log(`User connected in socket ${client.id}`);
});

export { httpServer, io };
