const dbConnect = require('../utils/mysql');
const bcrypt = require('bcrypt');

class UsersController {
    async postNew(req, res) {
        const { name, email, username, password } = req.body;
    
        try {
            if (!email) {
                return res.status(400).json({ error: 'Email missing' });
            }
            if (!password) {
                return res.status(400).json({ error: 'Missing password' });
            }
    
            const checkEmail = 'SELECT email FROM users WHERE email = ?';
            const [emailRows] = await dbConnect.con.promise().query(checkEmail, [email]);
    
            if (emailRows.length > 0) {
                return res.status(409).json({ error: "Email already exists" });
            }
    
            const checkUsername = 'SELECT username FROM users WHERE username = ?';
            const [usernameRows] = await dbConnect.con.promise().query(checkUsername, [username]);
    
            if (usernameRows.length > 0) {
                return res.status(400).json({ error: "Username taken. Choose another username" });
            }
    
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            // Check if the database connection is alive
            const isConnected = await dbConnect.isAlive();
    
            if (isConnected) {
                await dbConnect.addUser(name, email, hashedPassword, username);
                return res.status(201).json({ status: 201, message: "User registered successfully" });
            } else {
                return res.status(500).json({ message: "Failed to connect to the database" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    

    async deleteUser(req, res) {
        const { email } = req.body;
    
        if (!email) {
            return res.status(400).json({ error: "Email missing" });
        }
    
        try {
            const checkEmail = 'SELECT email FROM users WHERE email = ?';
            const [emailRows] = await dbConnect.con.promise().query(checkEmail, [email]);
    
            if (emailRows.length === 0) {
                return res.status(404).json({ error: `User with email ${email} not found` });
            }
    
            dbConnect.isAlive().then(async (isConnected) => {
                if (isConnected) {
                    try {
                        await dbConnect.removeUser(email);
                        return res.status(200).json({ message: `User with email ${email} deleted` });
                    } catch (error) {
                        console.error("Error deleting user:", error);
                        return res.status(500).json({ message: "Error deleting user" });
                    }
                } else {
                    return res.status(500).json({ message: "Error connecting to the database" });
                }
            });
        } catch (error) {
            console.error("Error checking user existence:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    async updateUser(req, res) {
        const { email, username, password } = req.body;
        if (!email) {
            res.status(400).json({message: "email doesn't exist"});
        }
        try {
            const saltRounds =10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const updateResult = await dbConnect.updateAUser(email, username, hashedPassword);

            if (updateResult.affectedRows > 0) {
                return res.status(200).json({ message: `User with email ${email} updated successfully` });
            } else {
                return res.status(500).json({ message: "Failed to update user" });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }




    async getUserDetails(req, res) {
        const { email } = req.params; 
        if (!email) {
          return res.status(400).json({ message: 'Email is required' });
        }
    
        try {
          const userDetails = await dbConnect.getUser(email);
    
          if (userDetails) {
            // User found, return details
            return await res.status(200).json(userDetails);
          } else {
            // User not found
            return res.status(404).json({ message: 'User not found' });
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
      }
}

const usersController = new UsersController();

module.exports = usersController;
