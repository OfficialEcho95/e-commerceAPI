const dbConnect = require('../utils/mysql');

class ProductDetails {
    constructor(product_id) {
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

    async product_uuid() {
        return this.getProperty('product_uuid');
    }
    async displayName() {
        return this.getProperty('name');
    }

    async displayPrice() {
        return this.getProperty('price');
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

module.exports = ProductDetails;