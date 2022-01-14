const DBManager = require('./db');
const dbManager = new DBManager();
const mongooseConn = dbManager.mongooseConnect();
const { v4: uuid } = require('uuid');

class Applications {

    constructor() { }

    async getFavorites({ id }) {
        try {
            const favorites = await this._find('favorites', { id })
            return favorites;
        } catch (error) {
            throw new Error(error);
        }
    }

    async saveToFavorites({ id, favorite }) {
        try {
            favorite['id'] = uuid();
            await this._save('favorites', { id, favorite });
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getApplications({ id }) {
        try {
            const applications = await this._find('applications', { id })
            return applications;
        } catch (error) {
            throw new Error(error);
        }
    }

    async saveApplication({ id, application }) {
        try {
            application['id'] = uuid();
            await this._save('applications', { id, application });
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    async editApplication({ id, application }) {
        try {
            await this._edit(
                'applications',
                { id, application: { id: application['id'] } },
                { $set: application }
            );
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteApplication({ id, applicationId }) {
        try {
            await this._delete(
                'applications',
                { id, application: { id: application['id'] } }
            );
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getSharedApplications({ id }) {
        try {
            const applications = await this._find('shared', { to: id })
            return applications;
        } catch (error) {
            throw new Error(error);
        }
    }

    async shareApplication({ id, application, shareTo }) {
        try {
            await this._save('shared', { from: id, to: shareTo, application });
            return true;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getColleges() {
        try {
            const collegeList = await this._find("us_colleges");
            console.log(collegeList.length);
            return collegeList;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getCollegeMajors() {
        try {
            const collegeMajors = await this._find("us_college_majors");
            return collegeMajors;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getStates() {
        try {
            const states = await this._find("us_states");
            return states;
        } catch (error) {
            throw new Error(error);
        }
    }

    getMongooseConn() {
        return mongooseConn;
    }

    async _find(collection = undefined, query = {}, options = {}) {
        const client = dbManager.getClient();
        var docs = [];
        try {
            await client.connect();
            const coll = client.db("hackathon").collection(collection);
            const cursor = coll.find();
            if ((await cursor.count()) === 0) {
                console.log("No Documents Found");
            }
            await cursor.forEach(doc => docs.push(doc));
        } catch (error) {
            throw new Error(error);
        } finally {
            await client.close();
            return docs;
        }
    }

    async _save(collection = undefined, doc = undefined) {
        const client = dbManager.getClient();
        var docs = [];
        try {
            await client.connect();
            const coll = client.db("hackathon").collection(collection);
            const result = await coll.insertOne(doc);
        } catch (error) {
            throw new Error(error);
        } finally {
            await client.close();
            return docs;
        }
    }

    async _edit(collection = undefined, query = {}, doc = undefined) {
        const client = dbManager.getClient();
        var docs = [];
        try {
            await client.connect();
            const coll = client.db("hackathon").collection(collection);
            const result = await coll.updateOne(query, doc);
        } catch (error) {
            throw new Error(error);
        } finally {
            await client.close();
            return docs;
        }
    }

    async _delete(collection = undefined, query = {}) {
        const client = dbManager.getClient();
        var docs = [];
        try {
            await client.connect();
            const coll = client.db("hackathon").collection(collection);
            const result = await coll.deleteOne(query);
        } catch (error) {
            throw new Error(error);
        } finally {
            await client.close();
            return docs;
        }
    }

}

module.exports = Applications;