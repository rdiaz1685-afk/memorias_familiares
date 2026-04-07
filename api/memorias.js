const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let cachedClient = null;

async function getClient() {
    if (!cachedClient) {
        cachedClient = new MongoClient(uri);
        await cachedClient.connect();
    }
    return cachedClient;
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const client = await getClient();
        const db = client.db('memorias_db');
        const col = db.collection('memorias');
        const data = await col.find({}, {
            projection: { _id: 0, id: 1, title: 1, year: 1, season: 1, location: 1 }
        }).sort({ id: 1 }).toArray();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
