require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

class DBManager {

    client;

    constructor() {
        this.client = new MongoClient(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    getClient() {
        return this.client;
    }

    mongooseConnect() {
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        const db = mongoose.connection;

        db.on("error", (error) => {
            throw new Error(error)
        });

        db.once("open", () => {
            console.log("mongoose connected");
        });

        return mongoose;
    }
}

module.exports = DBManager;