const express = require('express');
const { GetShopControl, GetShopsControl, AddShopControl, UpdateShopControl, DeleteShopControl } = require('../control/shops.js');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const shopRouter = express.Router();

const upload = require('../middleware/upload');

// Define routes
shopRouter.get('/', authenticateToken, authorizeRole(['customer', 'admin']), GetShopsControl);
shopRouter.get('/:shopId', authenticateToken, authorizeRole(['customer', 'admin']), GetShopControl);
shopRouter.post('/',[], authenticateToken, authorizeRole(['admin']), upload.single('Logo_source'), AddShopControl);
shopRouter.patch('/:shopId', authenticateToken, authorizeRole(['admin']), UpdateShopControl);
shopRouter.delete('/:shopId', authenticateToken, authorizeRole(['admin']), DeleteShopControl);

module.exports = shopRouter;
