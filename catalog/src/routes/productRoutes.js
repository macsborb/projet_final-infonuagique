const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes publiques
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Routes protégées (admin seulement)
router.post('/', 
  productController.verifyToken, 
  productController.isAdmin, 
  productController.createProduct
);

router.put('/:id', 
  productController.verifyToken, 
  productController.isAdmin, 
  productController.updateProduct
);

router.delete('/:id', 
  productController.verifyToken, 
  productController.isAdmin, 
  productController.deleteProduct
);

module.exports = router;