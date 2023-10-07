const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const dbConnect = require('../utils/mysql');

const TOKEN_EXPIRATION_TIME = 3600 * 1000;

class AuthController {
  constructor() {
    this.tokenStore = new Map();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const user = await dbConnect.getUser(email);
      console.log(user);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
      }

      user.password = await dbConnect.getHashedPassword(email);

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = this.generateToken(user.id);
        this.tokenStore.set(token, { user_id: user.id, email, expiration: Date.now() + TOKEN_EXPIRATION_TIME });
        return { token };
      } else {
        return { error: 'Unauthorized: Invalid credentials' };
      }
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Helper method to generate a token with user_id and expiration
  generateToken(user_id) {
    const token = uuidv4();
    const expiration = Date.now() + TOKEN_EXPIRATION_TIME;
    //associating user_id with the token
    return `${user_id}:${token}:${expiration}`;
  }

  async logout(req, res) {
    try {
      const authToken = req.headers['x-token'];

      if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized: Missing X-Token header' });
      }

      const tokenData = this.tokenStore.get(authToken);
      if (tokenData && tokenData.expiration > Date.now()) {
        this.tokenStore.delete(authToken);

        // Clear the token cookie on the client-side
        res.clearCookie('token');

        return res.status(204).json("Logged out");
      } else {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
      }
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

const authController = new AuthController();

module.exports = authController;
