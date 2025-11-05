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
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
    origin: allowedOrigins,
    credentials: true,   //access-control-allow-credentials:true
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
    optionSuccessStatus: 200
}));

// Explicitly handle CORS preflight for all routes
app.options('*', cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
}));


//routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/message",messageRoute);
app.use("/api/v1/friends", friendRoute);

// Resolve frontend dist path correctly in ESM
server.listen( PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`)
});
