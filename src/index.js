// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDb from './db/index.js'

dotenv.config({
    path: './env'
})

connectDb();








/*
import mongoose from 'mongoose'
import {DB_NAME} from "./constants"

import express from "express";
const app = express()

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERROE: ", error)
            throw error
        })
        
        app.listen(process.env.PORT, () => {
            console.log(`server is listening on port ${process.env.PORT}`);
        })
        
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()
*/
