const  {GetUser,GetUserById,AddUser,GetAllUsers,GetActiveUsers,UpdateUser}  =require( "../service/users.js");
const jwt = require('jsonwebtoken');

//get user by password and username
const GetUserControl = async (req, res) => {
    try {
      const { username, password } = req.body;

        const data = await GetUser(username, password);
        if (!data) {
            return res.status(401).send('שם משתמש או סיסמה שגויים.');
        }
        const token = jwt.sign({ id: data.id, role: data.role }, 'secretKey', { expiresIn: '1h' });
        res.json({ token, user: data });
    }
    catch(error) {
        console.error('Error in GetUserControl:', error);
        res.status(400).json({
            error: error.message,
            details: error.stack
        });
    }
  
  };

  //get user by id
  const GetUserByIdControl = async (req, res) => {
    try {
      const { userId } = req.params;
        const data = await GetUserById(userId);
        res.json(data)
    }
    catch(error) {
        console.log(error)
        res.status(400).send('error');
    }
  }

  //add user
  const AddUserControl = async (req, res) => {
    try {
      var  user  = req.body;
        const data = await AddUser(user);
        const token = jwt.sign({ id: data.insertId, role: user.role }, 'secretKey', { expiresIn: '1h' });
        user=GetUserById(data.insertId);
        res.json({token:token,user:user})
    }
    catch(error) {
        console.log(error)
        res.status(400).send('error');
    }
  }

  const GetAllUsersControl = async (req, res) => {
    try {
        const data = await GetAllUsers();
        res.json(data)
    }
    catch(error) {
        console.log(error)
        res.status(400).send('error');
    }
  }

  const GetActiveUsersControl = async (req, res) => {
    try {
        const data = await GetActiveUsers();
        res.json(data)
    }
    catch(error) {
        console.log(error)
        res.status(400).send('error');
    }
  }

  const UpdateUserControl = async (req, res) => {
    try {
      const  user  = req.body;
        const data = await UpdateUser(user);
        res.json(data)
    }
    catch(error) {
        console.log(error)
        res.status(400).send('error');
    }
    
  }
module.exports = {GetUserControl,
    GetUserByIdControl,
    AddUserControl,
    GetAllUsersControl,
    GetActiveUsersControl,
    UpdateUserControl
    };
