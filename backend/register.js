const UsersController = require('../controllers/UsersController');

class Register {
    async registerUser(req, res) {
        const { name, email, username, password } = req.body;

        try {
            const result = await UsersController.postNew(req, res);
            
            //redirections still giving me issue here
            if (result.status === 201) {
                res.redirect('/login'); //this still doesn't work
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const register = new Register();

module.exports = register;
