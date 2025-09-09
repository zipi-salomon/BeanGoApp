const jwt = require('jsonwebtoken');
const { AddMessage, GetAllMessages, MarkMessageRead } = require('../service/contact.js');
const { GetUserById } = require('../service/users.js');

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';
const   ContactControl = async (req, res) => {
  try {
    const  message  = req.body;
      const data = await AddMessage(message);
      res.json(data)
  }
  catch(error) {
      console.log(error)
      res.status(400).send('error');
  }
}

const GetAllMessagesControl = async (req, res) => {
  try {
    const messages = await GetAllMessages();
    return res.json(messages);
  } catch (error) {
    console.error('Error in GetAllMessagesControl:', error);
    return res.status(500).json({ error: 'שגיאה פנימית' });
  }
};

const MarkMessageReadControl = async (req, res) => {
  try {
    const { id } = req.params;
    await MarkMessageRead(id);
    return res.json({ message: 'סומן כנקרא' });
  } catch (error) {
    console.error('Error in MarkMessageReadControl:', error);
    return res.status(500).json({ error: 'שגיאה פנימית' });
  }
};

module.exports = {
  ContactControl,
  GetAllMessagesControl,
  MarkMessageReadControl,
};
