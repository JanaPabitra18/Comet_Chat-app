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
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,   //access-control-allow-credentials:true
    optionSuccessStatus: 200
}));


//routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/message",messageRoute);
app.use("/api/v1/friends", friendRoute);

// Resolve frontend dist path correctly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../frontend/dist');

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistPath));
  app.use((req, res) => res.sendFile(path.join(clientDistPath, 'index.html')));
} else {
  app.use("/", (req, res) => {
    res.send("API is running...");
  });
}

server.listen( PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`)
});
