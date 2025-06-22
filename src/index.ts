// src/index.ts

import express from 'express';
import patientRoutes from './routes/patientRoute'; 
import db from './database';

// Cria a aplicação Express
const app = express();
const PORT = process.env.PORT || 3000; // Usa a porta do .env ou a porta 3000

app.use(express.json());


app.use('/api', patientRoutes);

app.get('/', (req, res) => {
    res.send('API de Pacientes está no ar!');
});


// --- INICIA O SERVIDOR ---
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando com sucesso em http://localhost:${PORT}`);
    console.log('Banco de dados conectado.');
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Conexão com o banco de dados fechada.');
        server.close(() => {
            console.log('Servidor encerrado.');
            process.exit(0);
        });
    });
});