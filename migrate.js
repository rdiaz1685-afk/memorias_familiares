require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function migrate() {
    const uri = process.env.MONGODB_URI;
    if (!uri) { console.error('Falta MONGODB_URI en .env.local'); process.exit(1); }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Conectado a MongoDB Atlas');

        const db = client.db('memorias_db');
        const col = db.collection('memorias');

        const filePath = path.join(__dirname, 'memorias.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        let ok = 0;
        for (const m of data) {
            await col.replaceOne({ id: m.id }, m, { upsert: true });
            console.log(`  ✓ ${m.title}`);
            ok++;
        }
        console.log(`\nListo: ${ok} memoria(s) subida(s) a memorias_db.memorias`);
    } finally {
        await client.close();
    }
}

migrate().catch(err => { console.error(err); process.exit(1); });
