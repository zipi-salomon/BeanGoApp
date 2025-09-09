const express = require('express'); // הוספת שורת require
const { GetUserControl, GetUserByIdControl,AddUserControl,
    GetAllUsersControl,GetActiveUsersControl,UpdateUserControl} = require('../control/users.js');

const { authenticateToken, authorizeRole } = require('../middleware/auth');


const userRouter = express.Router();


userRouter.post('/login', GetUserControl);
userRouter.get('/active',authenticateToken,authorizeRole(['admin']), GetActiveUsersControl);
userRouter.get('/',authenticateToken,authorizeRole(['admin']), GetAllUsersControl);
userRouter.post('/', AddUserControl);
userRouter.patch('/',authenticateToken,authorizeRole(['customer','admin']), UpdateUserControl);
userRouter.get('/:userId',authenticateToken,authorizeRole(['customer','admin']), GetUserByIdControl);


module.exports = userRouter;
