// routes/contact.js
const express = require('express');
const { ContactControl, GetAllMessagesControl, MarkMessageReadControl } = require('../control/contact.js');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const contactRouter = express.Router();

// POST צור קשר: נגיש לכולם, ה-controller ידאג לנתונים
contactRouter.post('/', ContactControl);

// GET כל ההודעות – רק מנהל
contactRouter.get('/', authenticateToken, authorizeRole(['admin']), GetAllMessagesControl);

// PATCH לסימון הודעה כנקראה – רק מנהל
contactRouter.patch('/:id/read', authenticateToken, authorizeRole(['admin']), MarkMessageReadControl);

module.exports = contactRouter;
