const express = require('express');
const {
    GetProductControl,
    GetAllProductsControl,
    AddProductControl,
    UpdateProductControl,
    DeleteProductControl,
    GetProductsByShopControl
} = require('../control/products');

const { authenticateToken, authorizeRole } = require('../middleware/auth');
const upload = require('../middleware/uploadProduct'); // מעביר את multer החוצה

const productRouter = express.Router();

// Get product by ID
productRouter.get('/:productId', authenticateToken, authorizeRole(['customer', 'admin']), GetProductControl);

// Get all products
productRouter.get('/', authenticateToken, authorizeRole(['customer', 'admin']), GetAllProductsControl);

// Add new product – כולל העלאת קובץ
productRouter.post('/', authenticateToken, authorizeRole(['admin']), upload.single('p_img_source'), AddProductControl);

// Update existing product
productRouter.patch('/', authenticateToken, authorizeRole(['admin']), UpdateProductControl);

// Delete product
productRouter.delete('/:productId', authenticateToken, authorizeRole(['admin']), DeleteProductControl);

// Get products by shop ID
productRouter.get('/shop/:shopId', authenticateToken, authorizeRole(['customer', 'admin']), GetProductsByShopControl);

module.exports = productRouter;
