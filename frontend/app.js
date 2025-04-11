const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 80;

// Connecter à la base de données MySQL
const connection = mysql.createConnection({
  host: 'mysql', // nom du service mysql dans Kubernetes
  user: 'root',
  password: 'password',
  database: 'mysql'
});

// Middleware pour parser le JSON
app.use(express.json());

// Route par défaut pour GET / (accueil)
app.use(express.static(path.join(__dirname, 'views')));

// Route pour créer un compte
app.post('/create-account', (req, res) => {
    const { account_id, initial_balance } = req.body;
  
    connection.query(
      'INSERT INTO accounts (account_id, balance) VALUES (?, ?)',
      [account_id, initial_balance],
      (err, results) => {
        if (err) {
          res.status(500).send('Erreur lors de la création du compte.');
          return;
        }
        res.status(200).send('Compte créé avec succès.');
      }
    );
  });

// Route pour ajouter de l'argent à un compte
app.post('/deposit', (req, res) => {
  const { account_id, amount } = req.body;

  connection.query(
    'UPDATE accounts SET balance = balance + ? WHERE account_id = ?',
    [amount, account_id],
    (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors du dépôt.');
        return;
      }
      res.status(200).send('Dépôt réussi.');
    }
  );
});

// Route pour retirer de l'argent d'un compte
app.post('/withdraw', (req, res) => {
  const { account_id, amount } = req.body;

  connection.query(
    'UPDATE accounts SET balance = balance - ? WHERE account_id = ?',
    [amount, account_id],
    (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors du retrait.');
        return;
      }
      res.status(200).send('Retrait réussi.');
    }
  );
});

// Route pour récupérer le solde d'un compte
app.get('/balance/:account_id', (req, res) => {
  const account_id = req.params.account_id;

  connection.query(
    'SELECT balance FROM accounts WHERE account_id = ?',
    [account_id],
    (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération du solde.');
        return;
      }
      if (results.length > 0) {
        res.status(200).send(`Solde: ${results[0].balance}`);
      } else {
        res.status(404).send('Compte non trouvé.');
      }
    }
  );
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Frontend à l'écoute sur le port ${port}`);
});
