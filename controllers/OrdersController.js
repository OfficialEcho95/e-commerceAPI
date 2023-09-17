const { use } = require('../routes');
const order = require('../utils/orders');

/**
 * This module handles the class of orders.js
 */

class OrderItemsHandler {
    async createOrderHandler(req, res) {
        const { user_id, order_item_id } = req.body;

        try {
            if (!user_id || !order_item_id) {
                return res.status(400).json({ message: "Invalid user_id or order_item_id" });
            }

            const new_order = await order.createOrder(user_id, order_item_id);
            if (new_order) {
                return res.status(200).json({ new_order });
            }
            else {
                console.log("Error processing request");
                return res.status(400).json({ message: "Error processing request" });
            }
        }
        catch (error) {
            console.error("Internal server error");
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async orderByUserIdHandler(req, res) {
        const { user_id } = req.params;

        try {
            if (!user_id) {
                console.log("orders not found for this user");
                res.status(400).json({ message: "Invalid user_id" });
            }

            const orders = await order.getOrderByUserId(user_id);

            if (!orders) {
                console.log("Error fetching orders from the database");
                return res.status(500).json({ message: "Error fetching orders" });
            }

            if (orders === null) {
                console.log("Could not fetch from the database");
                return res.status(404).json({ message: "Could not get orders" });
            }
            return res.status(200).json({ orders })
        } catch (err) {
            console.error("Internal server error");
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    //this method doesn't work yet
    async orderDetailsHandler(req, res) {
        try {
            const { order_id } = req.query.order_id;

            if (!order_id) {
                return res.status(400).json({ message: "Bad request" });
            }

            const details = await order.getOrderDetails(order_id);

            if (!details) {
                console.error("Error fetching data from the database");
                return res.status(400).status({ message: "Error fetching data from the database" });
            }
            if (details === null) {
                console.log("Could not fetch from the database");
                return res.status(404).json({ message: "could not get details" });
            }
            return res.status(200).json({ details })
        } catch (error) {
            console.error("Internal server error");
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateOrderStatusHandler(req, res) {
        try {
            const { order_id } = req.params;
            const { newStatus } = req.body;

            if (!order_id && !newStatus) {
                return res.status(400).json({ message: "OrderId or status is invalid" });
            }
            const status = await order.updateOrderStatus(order_id, newStatus);

            if (!status) {
                return res.status(400).json({ message: "Error updating status" });
            }
            return res.status(200).json({ status })
        } catch (err) {
            console.error("Internal server error");
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async cancelOrderHandler(req, res) {
        const { order_id } = req.params;
    
        try {
            if (!order_id || isNaN(order_id)) {
                console.log("Invalid orderId in the request");
                return res.status(400).json({ message: "Invalid orderId" });
            }
    
            const canceled = await order.cancelOrder(order_id);
    
            if (!canceled) {
                console.log("Error canceling order in the database");
                return res.status(500).json({ message: "Error canceling order" });
            }
    
            return res.status(200).json({ message: "Order canceled successfully" });
        } catch (err) {
            console.error("Internal server error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    
    async deleteOrderHandler(req, res) {
        const { order_id } = req.params;
    
        try {
            if (!order_id || isNaN(order_id)) {
                console.log("Invalid orderId in the request");
                return res.status(400).json({ message: "Invalid orderId" });
            }
    
            const deleted = await order.deleteOrder(order_id);
    
            if (!deleted) {
                console.log("Error deleting order in the database");
                return res.status(500).json({ message: "Error deleting order" });
            }
    
            return res.status(200).json({ message: "Order deleted successfully" });
        } catch (err) {
            console.error("Internal server error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}


const orderItemHandler = new OrderItemsHandler();

module.exports = orderItemHandler;