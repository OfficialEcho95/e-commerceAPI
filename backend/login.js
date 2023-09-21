const axios = require('axios');

class Login {
    async loginUser(req, res) {
        const { email, password } = req.body;

        try {
            //here i try to authenticate and log user in on success
            const authHeader = `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`;

            const response = await axios.get('http://localhost:3000/connect', {
                headers: {
                    'Authorization': authHeader,
                },
            });

            //i try to redirect to the index file here. fails
            if (response.status === 200) {
                res.status(response.status).json("login successful")
            } else {
                res.status(500).json({ message: "User login failed" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const login = new Login();

module.exports = login;
