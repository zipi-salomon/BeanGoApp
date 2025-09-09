const  {GetShop,GetShops,AddShop,
    UpdateShop,DeleteShop}  =require( "../service/shops.js");

//get shop 
const GetShopControl = async (req, res) => {
    try {
        const { shopId } = req.params;
            const data = await GetShop(shopId);
            res.json(data)
    }
    catch(error) {
            console.log(error)
            res.status(400).send('error');
    }
}

const GetShopsControl = async (req, res) => {
    try {
        const data = await GetShops();
        res.json(data);
    } catch (error) {
        console.error('Error getting shops:', error);
        res.status(500).send('שגיאה בקבלת רשימת החנויות.');
    }
};

const AddShopControl = async (req, res) => {
    try {
        const  shopDetails  = req.body;
        if (!req.file) {
            return res.status(400).send('לא נבחר קובץ תמונה.');
          }
          const imageName = req.file.filename;
          const shopData = {
            ...shopDetails,
            Logo_source: imageName,
          };
            const data = await AddShop(shopData);
            res.json(data)
    }
    catch(error) {
            console.log(error)
            res.status(400).send('error');
    }
}

const UpdateShopControl = async (req, res) => {
    try {
        const  shop  = req.body;
            const data = await UpdateShop(shop);
            res.json(data)
    }
    catch(error) {
            console.log(error)
            res.status(400).send('error');
    }
}

const DeleteShopControl = async (req, res) => {
    try {
        const { shopId } = req.params;
            const data = await DeleteShop(shopId);
            res.json(data)
    }
    catch(error) {
            console.log(error)
            res.status(400).send('error');
    }
}
  module.exports = {
    GetShopControl,
    GetShopsControl,
    AddShopControl,
    UpdateShopControl,
    DeleteShopControl
    };
