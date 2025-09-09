const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Token missing');

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        const payload = jwt.decode(token);
        if (!payload) {
          return res.status(403).send('Invalid token');
        }

        const newToken = jwt.sign(
          { id: payload.id, role: payload.role },
          'secretKey',  
          { expiresIn: '1h' }  
        );

        res.setHeader('x-new-token', newToken);
        console.log('🔁 שרת חידש טוקן לאחר שפג');
        req.user = payload;
        next();
      } else {
        return res.status(403).send('Invalid token');
      }
    } else {
      req.user = user;
      next();
    }
  });
};
const authorizeRole = (roles) => {

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Forbidden - Insufficient permissions');
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};
