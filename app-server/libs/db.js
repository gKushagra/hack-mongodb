require('dotenv').config();
const { MongoClient } = require('mongodb');
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
}

module.exports = DBManager;