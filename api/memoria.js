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
        const id = parseInt(req.query.id);
        if (!id) return res.status(400).json({ error: 'id requerido' });
        const client = await getClient();
        const db = client.db('memorias_db');
        const col = db.collection('memorias');
        const doc = await col.findOne({ id }, { projection: { _id: 0 } });
        if (!doc) return res.status(404).json({ error: 'Memoria no encontrada' });
        res.status(200).json(doc);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
