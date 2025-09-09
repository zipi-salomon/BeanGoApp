const multer = require('multer');
const path = require('path');
const { GetShop } = require('../service/shops');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: async function (req, file, cb) {
        try {
            const { p_name, shop_id } = req.body;

            if (!p_name || !shop_id) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                return cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
            }

            const shop = await GetShop(shop_id);
            if (!shop) {
                return cb(new Error('Shop not found for naming file.'));
            }

            const shopName = shop.name.replace(/[^a-zA-Z0-9א-ת]/g, '_');
            const productName = p_name.replace(/[^a-zA-Z0-9א-ת]/g, '_');

            const newFilename = `${productName}-${shopName}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        } catch (error) {
            console.error("Error creating filename:", error);
            cb(error);
        }
    }
});

const upload = multer({ storage });
module.exports = upload;
