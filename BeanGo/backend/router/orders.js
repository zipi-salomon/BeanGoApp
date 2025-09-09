const express = require('express');
const {GetOrderControl,GetOrdersControl,AddOrderControl,UpdateOrderControl} = require('../control/orders.js');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const orderRouter = express.Router();
orderRouter.get('/',authenticateToken,authorizeRole(['customer','admin']), GetOrdersControl); 
orderRouter.get('/:orderId',authenticateToken,authorizeRole(['customer','admin']), GetOrderControl );
orderRouter.post('/',authenticateToken,authorizeRole(['customer','admin']), AddOrderControl);
orderRouter.patch('/:orderId',authenticateToken,authorizeRole(['admin','customer']), UpdateOrderControl);
module.exports = orderRouter;

