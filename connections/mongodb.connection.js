const { MongoClient } = require('mongodb');
const mongoUrl = "mongodb://localhost:27017/bd_proyecto1"

const getMongoConnection = async () => {
    try {
        const client = await MongoClient.connect(mongoUrl);
        return client.db();
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getMongoConnection };