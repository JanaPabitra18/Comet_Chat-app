import {Server} from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config({});

const app = express();

const server = http.createServer(app);

// Normalize and build allowed origins (exact + wildcard patterns)
const normalizeOrigin = (u) => (u || '')
  .toString()
  .trim()
  .replace(/\/$/, '')
  .toLowerCase();

const exactOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => normalizeOrigin(o));

const rawPatterns = (process.env.CLIENT_ORIGIN_PATTERNS || '')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);

const wildcardToRegex = (pattern) => {
  const norm = pattern.replace(/\/$/, '').toLowerCase();
  const escaped = norm.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexStr = '^' + escaped.replace(/\*/g, '.*') + '$';
  try { return new RegExp(regexStr); } catch { return null; }
};

const originRegexes = rawPatterns
  .map(wildcardToRegex)
  .filter((r) => r instanceof RegExp);

// Socket.IO accepts strings and RegExp in cors.origin
const socketCorsOrigins = [...exactOrigins, ...originRegexes];

const io = new Server(server, {
  cors: {
    origin: socketCorsOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId) => {
   return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}


io.on('connection', (socket)=>{
    console.log(`User connected: ${socket.id}`);
    const userId = socket.handshake.query.userId
    if(userId !== undefined){
        userSocketMap[userId] = socket.id;
    } 

    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    socket.on('disconnect', ()=>{
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
    

})

export {app, io, server};
