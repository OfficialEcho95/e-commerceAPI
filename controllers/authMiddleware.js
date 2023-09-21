const AuthController = require('../controllers/AuthController'); 
const authController = new AuthController();

// Middleware for user authentication
function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
  }

  const authData = authHeader.split(' ')[1];
  if (!authData) {
    return res.status(401).json({ error: 'Missing authorization data' });
  }

  const [email, password] = Buffer.from(authData, 'base64').toString().split(':');

  authController
    .authenticate(email, password)
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
      }

      req.user = user;
      next();
    })
    .catch((error) => {
      console.error('Authentication error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
}

// Middleware for user authorization
function authorizeUser(req, res, next) {
  // Check if the authenticated user has the necessary permissions
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Access denied' });
  }
}

module.exports = {
  authenticateUser,
  authorizeUser,
};
