const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/logos');
    },
    filename: async function (req, file, cb) {
        try {
            const { name } = req.body;
            if (!name) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                return cb(null, 'shop-' + uniqueSuffix + path.extname(file.originalname));
            }

            const shopName = name.replace(/[^a-zA-Z0-9א-ת]/g, '_');
            const newFilename = `${shopName}${path.extname(file.originalname)}`;
            cb(null, newFilename);
        } catch (error) {
            console.error("Error creating filename:", error);
            cb(error);
        }
    }
});

const upload = multer({ storage });
module.exports = upload;
