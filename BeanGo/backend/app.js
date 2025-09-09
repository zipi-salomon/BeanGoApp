const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Routers
const userRouter = require('./router/users.js');
const productRouter = require('./router/products.js');
const shopRouter = require('./router/shops.js');
const orderRouter = require('./router/orders.js');
const contactRouter = require('./router/contact.js');

const app = express();

// Ensure the images directory exists for file uploads
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}
const PORT = 3000;

// Middleware
app.use(cors({
  exposedHeaders: ['x-new-token'] // Enable CORS and expose custom headers
}));
app.use(express.json());

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// API Routes
app.use('/users', userRouter);
app.use('/contact', contactRouter);
app.use('/products', productRouter);
app.use('/shops', shopRouter);
app.use('/orders', orderRouter);

// Root route for testing
app.get('/', (req, res) => {
  res.send('שלום מהשרת ב-Express!');
});

// Start the server - must be at the end
app.listen(PORT, () => 
  console.log(`Server is running on port ${PORT}`)
);
