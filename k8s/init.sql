-- Créer la base de données si elle n'existe pas déjà
CREATE DATABASE IF NOT EXISTS mysql;

-- Sélectionner la base de données
USE mysql;

-- Créer la table accounts
CREATE TABLE IF NOT EXISTS accounts (
  account_id INT PRIMARY KEY,
  balance DECIMAL(10, 2) NOT NULL
);

-- Insérer un compte d'exemple
INSERT INTO accounts (account_id, balance) VALUES (1, 1000.00);
