-- Créer la base de données si elle n'existe pas déjà
CREATE DATABASE IF NOT EXISTS mysql;

-- Sélectionner la base de données
USE mysql;

-- Créer la table accounts
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL
);