//const express= require('express');
import express from 'express';
import dotenv from 'dotenv';  
import connectDB from './database.js';
import userRoute from './routes/userRoute.js';  
import cors from 'cors';
import messageRoute from './routes/messageRoute.js';
import friendRoute from './routes/friendRoute.js';
import cookieParser from 'cookie-parser';
import {app,server} from './socket/socket.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({});
const PORT = process.env.PORT || 5000;



//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// const corsOptions={
//     origin:'http://localhost:5173',
//     credentials:true,            //access-control-allow-credentials:true
//     // optionSuccessStatus:200
// }
// Support multiple allowed origins via comma-separated CLIENT_ORIGIN
const normalizeOrigin = (u) => (u || '')
  .toString()
  .trim()
  .replace(/\/$/, '')
  .toLowerCase();

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => normalizeOrigin(o));

// Optional wildcard patterns, e.g. "*.netlify.app,https://*.mydomain.com"
const rawPatterns = (process.env.CLIENT_ORIGIN_PATTERNS || '')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);

// Convert wildcard patterns to regexes
const wildcardToRegex = (pattern) => {
  // Normalize (strip trailing slash, lowercase) but keep '*' to expand
  const norm = pattern.replace(/\/$/, '').toLowerCase();
  // Escape regex special chars except '*'
  const escaped = norm.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  // Replace '*' with '.*'
  const regexStr = '^' + escaped.replace(/\*/g, '.*') + '$';
  try { return new RegExp(regexStr); } catch { return null; }
};

const originRegexes = rawPatterns
  .map(wildcardToRegex)
  .filter((r) => r instanceof RegExp);

const corsConfig = {
  origin: (origin, callback) => {
    // Allow non-browser requests (no origin) and matching origins
    if (!origin) return callback(null, true);
    const norm = normalizeOrigin(origin);
    if (allowedOrigins.includes(norm)) return callback(null, true);
    // Fallback to wildcard pattern matching
    if (originRegexes.some((rx) => rx.test(norm))) return callback(null, true);
    return callback(new Error(`CORS: Origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
  optionSuccessStatus: 200,
};

app.use(cors(corsConfig));

// Explicitly handle CORS preflight for all routes (Express 5 safe)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
      if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
      }
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
      return res.sendStatus(204);
    }
  }
  next();
});


//routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/message",messageRoute);
app.use("/api/v1/friends", friendRoute);

// Resolve frontend dist path correctly in ESM
server.listen( PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`)
});
