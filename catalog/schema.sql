CREATE DATABASE IF NOT EXISTS catalog_db;
USE catalog_db;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Index pour accélérer les recherches
CREATE INDEX idx_product_name ON products(name);

-- Insérer quelques données de test
INSERT INTO products (name, description, price, image_url, stock) VALUES
('Smartphone XYZ', 'Un smartphone haut de gamme avec écran OLED et appareil photo 48MP', 699.99, 'smartphone.jpg', 25),
('Laptop Pro', 'Ordinateur portable ultra fin avec 16GB RAM et SSD 512GB', 1299.99, 'laptop.jpg', 15),
('Casque Audio', 'Casque sans fil avec réduction de bruit active', 249.99, 'casque.jpg', 40),
('Tablette 10"', 'Tablette tactile 10 pouces avec stylet inclus', 349.99, 'tablette.jpg', 20),
('Montre connectée', 'Montre intelligente avec suivi de santé et GPS intégré', 199.99, 'montre.jpg', 30);