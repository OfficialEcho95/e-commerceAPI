const { use } = require('../routes');
const dbConnect = require('./mysql');
const { v4: uuidv4 } = require('uuid');

class Orders {

    async getCartItems(userId) {
        try {
            // Validate userId
            if (!userId) {
                throw new Error("Invalid userId");
            }
    
            const query = "SELECT order_item_id, quantity, price FROM order_items WHERE user_id = ?";
            const [cartItems] = await dbConnect.con.promise().query(query, [userId]);
    
            let totalAmount = 0;
            for (const item of cartItems) {
                totalAmount += item.quantity * item.price;
            }
            return totalAmount;
        } catch (err) {
            console.error("Error encountered:", err.message);
            throw err;
        }
    
    }

    async createOrder(user_id) {
        try {
            // Validate user_id
            if (!user_id) {
                throw new Error("Invalid user_id");
            }

            const total_amount = await this.getCartItems(user_id);
            if (!total_amount) {
                throw new Error("Failure creating order: Unable to calculate total amount");
            }

            // Generates a new UUID for order_id
            const order_id = uuidv4();

            const command =
                `INSERT INTO orders (order_id, user_id, order_date, total_amount, payment_status) \
            VALUES (?, ?, NOW(), ?, 'Pending')`;

            const [order] = await dbConnect.con.promise().query(command, [order_id, user_id, total_amount]);

            if (order.affectedRows > 0) {
                return "Successfully created order";
            } else {
                throw new Error("Failure creating order");
            }
        } catch (err) {
            console.error("Error encountered:", err.message);
            throw err;
        }
    }


    async clearCart(user_id) {
        try {
            if (!user_id) {
                throw new Error("Invalid user_id");
            }

            const clearCartQuery = "DELETE FROM order_items WHERE user_id = ?";
            const [result] = await dbConnect.con.promise().query(clearCartQuery, [user_id]);

            return result.affectedRows > 0;
        } catch (err) {
            console.error("Error encountered while clearing cart:", err.message);
            throw err;
        }
    }



    //there should also be a similar method but with name
    async getOrderByUserId(user_id) {
        const command = `SELECT * FROM orders WHERE user_id = ?`;
        try {
            const [orders] = await dbConnect.con.promise().query(command, [user_id]);

            if (!orders && orders.length === 0) {
                return []
            }
            else {
                return orders;
            }
        } catch (error) {
            console.error("Error encountered:", error);
            throw error;
        }
    }

    async getOrderDetails(order_id) {
        const command = `SELECT * FROM order_items WHERE order_id = ?`;
        try {
            const [orderItems] = await dbConnect.con.promise().query(command, [order_id]);

            if (orderItems.length > 0) {
                return orderItems[0];
            }
            else { return [] }
        } catch (error) {
            console.error("Error fetching order items:", error);
            throw error;
        }
    }

    //can still be automated such that when user completes order it becomes completed from pending
    //will be done in the future
    async updateOrderStatus(order_id, newStatus) {
        const command = `UPDATE orders SET status = ? WHERE order_id = ?`;
        try {
            const [result] = await dbConnect.con.promise().query(command, [newStatus, order_id]);
            return (result.affectedRows > 0);
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }

    async cancelOrder(orderId) {
        const command = `UPDATE orders SET status = 'Cancelled' WHERE order_id = ?`;
        try {
            const [result] = await dbConnect.con.promise().query(command, [orderId]);
            return (result.affectedRows > 0);
        } catch (error) {
            console.error("Error canceling order:", error);
            throw error;
        }
    }


    // Delete Order
    async deleteOrder(orderId) {
        const deleteOrderCommand = `DELETE FROM orders WHERE order_id = ?`;
        const deleteOrderItemsCommand = `DELETE FROM order_items WHERE order_id = ?`;
        try {
            await dbConnect.con.promise().query(deleteOrderItemsCommand, [orderId]);
            const [result] = await dbConnect.con.promise().query(deleteOrderCommand, [orderId]);
            return (result.affectedRows > 0);
        } catch (error) {
            console.error("Error deleting order:", error);
            throw error;
        }
    }
}

const orders = new Orders();

module.exports = orders;
