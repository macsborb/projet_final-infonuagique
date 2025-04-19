const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');

// Utilisation de la variable d'environnement pour le JWT
const JWT_SECRET = process.env.AUTH_JWT_SECRET || 'your_jwt_secret_key';

// Middleware pour vérifier l'authentification
exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  
  if (!bearerHeader) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }
  
  try {
    const token = bearerHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier si l'utilisateur est administrateur
exports.isAdmin = (req, res, next) => {
  // Pour simplifier, nous supposons que les utilisateurs avec un ID spécifique sont des administrateurs
  if (req.user && req.user.id === 1) { // Supposons que l'utilisateur avec ID 1 est admin
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé: droits d\'administrateur requis' });
  }
};

// Obtenir tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur dans getAllProducts:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Erreur dans getProductById:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouveau produit (réservé aux administrateurs)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image_url, stock } = req.body;
    
    // Validation de base
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'Nom, description et prix sont requis' });
    }
    
    const newProduct = await Product.create({
      name,
      description,
      price,
      image_url,
      stock
    });
    
    res.status(201).json({
      message: 'Produit créé avec succès',
      product: newProduct
    });
  } catch (error) {
    console.error('Erreur dans createProduct:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un produit (réservé aux administrateurs)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, image_url, stock } = req.body;
    const productId = req.params.id;
    
    // Vérifier si le produit existe
    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    // Mettre à jour le produit
    const success = await Product.update(productId, {
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      image_url: image_url !== undefined ? image_url : product.image_url,
      stock: stock !== undefined ? stock : product.stock
    });
    
    if (success) {
      const updatedProduct = await Product.getById(productId);
      res.status(200).json({
        message: 'Produit mis à jour avec succès',
        product: updatedProduct
      });
    } else {
      res.status(500).json({ message: 'Échec de la mise à jour du produit' });
    }
  } catch (error) {
    console.error('Erreur dans updateProduct:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un produit (réservé aux administrateurs)
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Vérifier si le produit existe
    const product = await Product.getById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    // Supprimer le produit
    const success = await Product.delete(productId);
    
    if (success) {
      res.status(200).json({ message: 'Produit supprimé avec succès' });
    } else {
      res.status(500).json({ message: 'Échec de la suppression du produit' });
    }
  } catch (error) {
    console.error('Erreur dans deleteProduct:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Rechercher des produits par nom ou description
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Paramètre de recherche requis' });
    }
    
    const products = await Product.search(query);
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur dans searchProducts:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};