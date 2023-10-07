const mydb = require("mysql2");
const dbConfig = require("../config");

class DBConnect {
    constructor() {
        this.con = mydb.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
        });

        // Handle errors
        this.con.on('error', (error) => {
            console.error('Mysql connection Error:', error);
        });
    }

    async isAlive() {
        return new Promise((resolve, reject) => {
            this.con.connect((err) => {
                if (err) {
                    console.error('Mysql connection Error:', err);
                    reject(false);
                } else {
                    console.log('Database connected.');
                    resolve(true);
                }
            });
        });
    }

    //this table is only here for reference
    createTable() {
        const table = "show tables";
        this.con.query(table, (error, result) => {
            if (error) {
                throw error;
            }
            console.log();
        })
    }

    async addUser(name, email, password, username) {
        const command = "INSERT INTO users (name, email, password, username) VALUES (?, ?, ?, ?)";
        try {
            const result = await this.con.promise().query(command, [name, email, password, username]);
            return result;
        } catch (err) {
            console.error("Error adding user:", err)
        }

    }

    async removeUser(email) {
        const command = "DELETE FROM users WHERE email = ?";
        try {
            return await this.con.promise().query(command, [email]);
        } catch(error) {
            console.error("Error removing: ", email);
        }
    }

    async updateAUser(email, username, password) {
        const command = "UPDATE users SET username = ?, password = ? WHERE email = ?"
        try {
            return await this.con.promise().query(command, [username, password, email]);
        } catch (error) {
            console.error("Error updating user", error);
        }
    }


    async getUser(email) {
      const command = 'SELECT name, email, username, id FROM users WHERE email = ?';
      try {
        const [rows] = await this.con.promise().query(command, [email]);
        if (rows.length > 0) {
          return rows[0]; 
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    }

    async getHashedPassword (email) {
        const command = "SELECT password FROM users WHERE email = ?";
        try {
            const [rows] = await this.con.promise().query(command, [email]);
            if (rows.length > 0) {
            return rows[0].password;
            }
            else {
                return null;
            }
        } catch (error) {
            console.error("Error returning password");
        }
    }

    async storeToken(email, token) {
        const command = "UPDATE users SET token = ? WHERE email = ?";
        try {
            const [result] = await this.con.promise().query(command, [token, email]);
            if (result.affectedRows > 0) {
                console.log("Token stored successfully");
            } else {
                console.error("Failed to store token");
            }
        } catch (error) {
            console.error("Error storing token:", error);
        }
    }
}


const dbConnect = new DBConnect();

module.exports = dbConnect;
