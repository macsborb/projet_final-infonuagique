const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(express.static('views'));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connexion à la base de données
db.connect(err => {
    if (err) {
        console.error("Erreur MySQL:", err);
        process.exit(1);
    } else {
        console.log("Connecté à MySQL");
    }
});

// Création compte
app.post('/create-account', (req, res) => {
    const {name, balance} = req.body;
    db.query('INSERT INTO accounts (name, balance) VALUES (?, ?)', [name, balance], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({message: 'Compte créé'});
    });
});

// Effectuer un virement
app.post('/transfer', (req, res) => {
    const {fromId, toId, amount} = req.body;
    db.beginTransaction(err => {
        if (err) return res.status(500).send(err);

        db.query('UPDATE accounts SET balance = balance - ? WHERE id = ?', [amount, fromId], (err) => {
            if (err) return db.rollback(() => res.status(500).send(err));

            db.query('UPDATE accounts SET balance = balance + ? WHERE id = ?', [amount, toId], (err) => {
                if (err) return db.rollback(() => res.status(500).send(err));

                db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).send(err));
                    res.status(200).send({message: 'Virement effectué'});
                });
            });
        });
    });
});

// Liste des comptes
app.get('/accounts', (req, res) => {
    db.query('SELECT * FROM accounts', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Écoute du serveur
app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));
