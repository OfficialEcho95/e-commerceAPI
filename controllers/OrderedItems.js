const orderItems = require('../utils/order_items');
const dbConnect = require('../utils/mysql');
/**
 * This module/endpoint handles the methods in the order_items.js file
 */

class OrderedItems {
    async addItemHandler(req, res) {
        try {
            const { user_id, product_uuid, quantity } = req.body;
            if (!user_id || !product_uuid || !quantity) {
                return res.status(400).json({
                    message: "Invalid user_id, \
          product_uuid, or quantity" });
            }

            dbConnect.isAlive();
            const message = await orderItems.addItem(product_uuid, user_id, quantity);
            return res.status(201).json({ message });
        } catch (error) {
            console.error("Internal Error", error);
            return res.status(500).json({ message: "Error encountered" });
        }
    }
    
    async getItemsHandler(req, res) {
        /**
         * returns the items in the user cart
         */
        try {
            const { user_id } = req.params;
            if (!user_id) {
                return res.status(400).json({ message: "Invalid user_id" });
            }

            dbConnect.isAlive();
            const cart = await orderItems.getItems(user_id);

            if (cart) {
                return res.status(200).json({cart});
            } else {
                return res.status(400).json({ message: "Your cart is empty" });
            }
        } catch (error) {
            console.error("Internal server error", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteItemHandler(req, res) {
        try {
            const { user_id, product_uuid } = req.body;
            if (!user_id && !product_uuid) {
                return res.status(400).json({ message: "Invalid user_id or product_uuid" });
            }
            const result = await orderItems.deleteItem(product_uuid, user_id);
            
            return res.status(200).json(result);
        } catch (error) {
            console.error("Internal server error", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getItemByIdHandler(req, res) {
        try {
            const { product_uuid, user_id } = req.body;
            if (!product_uuid || !user_id) {
                return res.status(400).json({ message: "Invalid user_id or product_uuid" });
            }

            console.log(product_uuid, user_id);
            const items = await orderItems.getItemById(product_uuid, user_id);

            console.log(items);
            if (items) {
                return res.status(200).json(items);
            } else {
                return res.status(404).json({ message: "Item not found in the cart" });
            }
        } catch (error) {
            console.error("Internal server error", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateItemHandler(req, res) {
        try {
            const { user_id, product_uuid, quantity } = req.body;
            if (!user_id || !product_uuid || !quantity) {
                return res.status(400).json({ message: "Invalid user_id, product_uuid, or quantity" });
            }

            const result = await orderItems.updateItem(product_uuid, quantity, user_id);
            if (result) {
                return res.status(200).json({ message: "Item quantity updated successfully" });
            } else {
                return res.status(404).json({ message: "Item not found in the cart or update failed" });
            }
        } catch (error) {
            console.error("Internal server error", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}


const orderedItems = new OrderedItems();

module.exports = orderedItems;
