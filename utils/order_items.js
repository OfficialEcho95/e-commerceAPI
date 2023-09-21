const dbConnect = require('../utils/mysql');

/**
 * This module creates methods handled by the OrderItems.js file
 */

class OrderItems {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async addItem(product_uuid, user_id, quantity) {
        try {
            const command = `
                INSERT INTO order_items(user_id, product_uuid, quantity, price)
                SELECT ?, ?, ?, price
                FROM products
                WHERE product_uuid = ?`;
    
            const [item] = await dbConnect.con.promise().query(command, [user_id, product_uuid, quantity, product_uuid]);
    
            if (item === null) {
                return item[0];
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error encountered connecting to the database:", error);
            throw error;
        }
    }
    

    async getItems(user_id) {
        try {

            this.user_id = user_id;
            const command = `SELECT * FROM order_items WHERE user_id = ?`;
            const [all_items] = await dbConnect.con.promise().query(command, [user_id]);
    
            if (all_items) {
                return all_items;
            } else {
                return null;
            }
        } catch (err) {
            console.error("Error Encountered:", err);
            throw err;
        }
    }
    

    async deleteItem(product_uuid, user_id) {
        try {
            this.user_id = user_id; 
            const command = 'DELETE FROM order_items WHERE product_uuid = ? AND user_id = ?';

            const [result] = await dbConnect.con.promise().query(command, [product_uuid, user_id]);

            console.log(product_uuid);
            console.log(user_id);
            if (result.affectedRows > 0) {
                return { message: 'Item successfully deleted' };
            } else {
                return { message: 'Item not found or already deleted' };
            }
        } catch (error) {
            console.error("Error encountered connecting to the database:", error);
            throw error;
        }
    }

    async getItemById(product_uuid, user_id) {
        this.user_id = user_id;
        const command = `SELECT order_items.*, products.price, products.name
        FROM order_items
        INNER JOIN products ON order_items.product_uuid = products.product_uuid
        WHERE order_items.product_uuid = ? AND order_items.user_id = ?`;
        try {
            console.log('Executing SQL query:', command);
            const [items] = await dbConnect.con.promise().query(command, [product_uuid, user_id]);
            
            if (items !== null && items.length > 0) {
                return items[0];
            }
            else {
                console.error("Couldn't get anything from the query");
                return [];
            }
        } catch (error) {
            console.log("Error Encountered connecting to the database");
            throw error;
        }
    }

    async updateItem(product_uuid, quantity, user_id) {
        this.user_id = user_id;
        const command = `UPDATE order_items SET quantity = ? WHERE product_uuid = ? AND user_id = ?`;

        try {
            const [items] = await dbConnect.con.promise().query(command, [quantity, product_uuid, user_id]);

            if (items.affectedRows > 0) {
                return true;
            }
            else {
                console.error("Couldn't get anything from the query");
                return false;
            }
        } catch (error) {
            console.log("Error encountered while connecting to the database");
            throw null;
        }
    }
}


const orderItems = new OrderItems();

module.exports = orderItems;