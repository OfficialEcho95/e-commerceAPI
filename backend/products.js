const dbConnect = require('../utils/mysql'); // Import your MySQL connection module

class Product {
    constructor(user_id, product_id) {
        this.user_id = user_id;
        this.product_id = product_id;
    }

    async getProperty(propertyName) {
        try {
            
            const command = `
                SELECT ${propertyName}
                FROM products
                WHERE product_uuid = ?;
            `;
            const [rows] = await dbConnect.con.promise().query(command, [this.product_id]);

            if (rows.length > 0) {
                return rows[0][propertyName] || null;
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error fetching ${propertyName}`, error);
            throw error;
        }
    }

    async displayPrice() {
        return this.getProperty('price');
    }

    async displayName() {
        return this.getProperty('name');
    }

    async displayDescription() {
        return this.getProperty('description');
    }

    async displayRating() {
        return this.getProperty('rating');
    }

    async displayImage() {
        return this.getProperty('image_url');
    }
}

module.exports = Product;
