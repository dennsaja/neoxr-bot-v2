const { MongoClient } = require('mongodb');
const fs = require('fs');

// Ganti dengan URI MongoDB Anda
const uri = "mongodb+srv://xinzuo:pw@cluster0.mkkspou.mongodb.net/?retryWrites=true&w=majority&tls=true&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Koneksi ke database
        await client.connect();
        const database = client.db('data');
        const collection = database.collection('database'); // Nama koleksi Anda

        // Membaca file JSON
        const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

        // Membuat dokumen dengan struktur yang diinginkan dan _id=1
        const document = {
            _id: 1, // Menetapkan _id menjadi 1
            users: data.users || [],
            chats: data.chats || [],
            groups: data.groups || [],
            statistic: data.statistic || {},
            sticker: data.sticker || {},
            setting: data.setting || {}
        };

        // Hapus koleksi lama jika ada (opsional, sesuai kebutuhan)
        await collection.deleteMany({});

        // Insert data ke MongoDB
        const result = await collection.insertOne(document);
        console.log(`Dokumen telah berhasil dimasukkan dengan ID: ${result.insertedId}`);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        // Tutup koneksi
        await client.close();
    }
}

run().catch(console.dir);