const db = require('../utils/mysql');

class AppController {
  async getStatus(req, res) {
    try {
      if (await db.isAlive()) {
        return res.status(200).json({ status: 'OK' });
      } else {
        return res.status(500).json({ status: 'Database connection error' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: 'Internal server error' });
    }
  }
}

const appController = new AppController();

module.exports = appController;
