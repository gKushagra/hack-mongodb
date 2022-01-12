const DBManager = require('./db');
const dbManager = new DBManager();

class Applications {

    constructor() { }

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

}

module.exports = Applications;