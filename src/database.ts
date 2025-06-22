import sqlite3 from "sqlite3";

const DBSOURCE = "database.db";
const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Conectado ao banco de dados.');
        db.exec(`CREATE TABLE IF NOT EXISTS patient (
                id	INTEGER PRIMARY KEY AUTOINCREMENT,
                name	TEXT NOT NULL,
                birthDate	TEXT NOT NULL,
                phoneNumber	TEXT NOT NULL,
                cpf	TEXT NOT NULL UNIQUE,
                rg	TEXT NOT NULL UNIQUE,
                susCard TEXT NOT NULL UNIQUE,
                neighborhood	TEXT NOT NULL,
                street	TEXT NOT NULL,
                houseNumber	INTEGER NOT NULL,
                city	TEXT,
                state	TEXT
                );
                
                CREATE TABLE IF NOT EXISTS receptionist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS service (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                idPatient INTEGER NOT NULL,
                idRecepcionist INTEGER NOT NULL,
                dateService DATETIME DEFAULT (DATETIME('now')),
                FOREIGN KEY (idPatient) REFERENCES patient(id),
                FOREIGN KEY (idRecepcionist) REFERENCES receptionist(id)
                );

                CREATE TABLE IF NOT EXISTS priorityQueue (
                idService INTEGER NOT NULL UNIQUE,
                FOREIGN KEY (idService) REFERENCES service(id)
                );

                CREATE TABLE IF NOT EXISTS chieffTriage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                coren TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS triage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dateTriage DATETIME DEFAULT (DATETIME('now')),
                idChieffTriage INTEGER NOT NULL,
                idServicePQ INTEGER NOT NULL,
                pressure TEXT NOT NULL,
                temperature TEXT NOT NULL,
                priority INTEGER,
                symptoms TEXT,
                FOREIGN KEY(idChieffTriage) REFERENCES chieffTriage(id),
                FOREIGN KEY(idServicePQ) REFERENCES priorityQueue(idService)
                );

                CREATE TABLE IF NOT EXISTS medicalQueue (
                idTriage INTEGER NOT NULL UNIQUE,
                FOREIGN KEY (idTriage) REFERENCES triage(id)
                );

                CREATE TABLE IF NOT EXISTS doctor (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                crm TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS Consult (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                idDoctor INTEGER NOT NULL,
                idServiceMQ INTEGER NOT NULL,
                diagnosis TEXT NOT NULL,
                prescription TEXT NOT NULL,
                FOREIGN KEY (idDoctor) REFERENCES doctor(id),
                FOREIGN KEY (idServiceMQ) REFERENCES medicalQueue(idTriage)
                );
                `,
            (err: Error | null) => {
            if (err) {
                console.error("Erro ao criar tabelas: " + err.message);
            } else {
                console.log("Tabelas verificadas/criadas com sucesso.");
            }
                });
    }
});

export default db;