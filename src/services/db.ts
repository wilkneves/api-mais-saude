import sqlite from 'sqlite3';

const DBSOURCE = "database.db";

const verboseSqlite = sqlite.verbose();

const db = new verboseSqlite.Database(DBSOURCE, (err) => {
    if (err) {
        console.error('Error ao abrir banco de dados' + err.message);
        throw err;
    }
    console.log('conectado ao banco de dados');
});

export default db;