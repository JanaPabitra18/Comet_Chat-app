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
    origin: 'http://localhost:5173',
    credentials:true ,   //access-control-allow-credentials:true
     optionSuccessStatus:200
}));


//routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/message",messageRoute);
app.use("/api/v1/friends", friendRoute);

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

server.listen( PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`)
});
