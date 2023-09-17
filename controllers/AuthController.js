const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const dbConnect = require('../utils/mysql');

/**
 * This module contains the authentication for users.
 * @getConnect method: This method authenticates the user
 * @getDisconnect method: this method logs the user out
 * by deleting their authentication token from the temporary 
 * token store
 */


class AuthController {
    constructor() {
        this.tokenStore = new Map();
        this.getConnect = this.getConnect.bind(this);
        this.getDisconnect = this.getDisconnect.bind(this);
    }

    //currentLY user sessions/authentication crash when server crashes.
    //I'll use redis to persist this error in the future
    async getConnect(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
            }

            const authData = authHeader.split(' ')[1];
            if (!authData) {
                return res.status(401).json({ error: 'Missing authorization data' });
            }

            const [email, password] = Buffer.from(authData, 'base64').toString().split(':');
            const user = await dbConnect.getUser(email);
            console.log(user);

            if (!user) {
                console.log(user);
                return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
            }

            user.password = await dbConnect.getHashedPassword(email);

            const isPasswordValid = await bcrypt.compare(password, user.password);

            console.log('Password is valid:', isPasswordValid);
            
            if (isPasswordValid) {
                const token = uuidv4();
                this.tokenStore.set(token, email);
                console.log(this.tokenStore);
                return res.status(200).json({ token });
            } else {
                return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
            }
        } catch (error) {
            console.error('Authentication error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }


    async getDisconnect(req, res) {
        try {
            const authToken = req.headers['x-token'];

            if (!authToken) {
                return res.status(401).json({ error: 'Unauthorized: Missing X-Token header' });
            }

            //To check if userEmail exists
            const userEmail = this.tokenStore.has(authToken);
            if (userEmail) {
                // Token found in tokenStore, delete it.
                this.tokenStore.delete(authToken)
                return res.status(204).json("Logged out"); // Successfully signed out.
            } else {
                return res.status(401).json({ error: 'Unauthorized: Invalid token' });
            }
        } catch (error) {
            console.error('Sign-out error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

const authController = new AuthController();

module.exports = authController;