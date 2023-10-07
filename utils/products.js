const dbConnect = require('../utils/mysql');
const uuid = require('uuid');

class ProductsController {
    async addNewProduct(name, description, price, quantity, image_url, rating) {
        const product_uuid = uuid.v4();
        const command = "INSERT INTO products (product_uuid, name, description, price,\
            quantity, image_url, rating) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const properties = [product_uuid, name, description, price, quantity, image_url, rating];
        try {
            const [newProduct] = await dbConnect.con.promise().query(command, properties)
            if (newProduct && newProduct.affectedRows > 0) {
                console.log(product_uuid);
                return product_uuid;
            }
            return null;
        } catch (error) {
            console.error("problem adding new product:", error);
            return null;
        }
    }


    async getAllItems() {
        try {
            const command = "SELECT * FROM products";

            const [allItems] = await dbConnect.con.promise().query(command);

            if (!allItems || allItems.length == 0) {
                return [];
            }
            else {
                return allItems;
            }
        } catch (error) {
            console.error("Error fetching from the database:", error);
            return null;
        }
    }


    async getItemDetails(id) {
        try {
            const command = "SELECT name, description, price, quantity, image_url, product_uuid, rating FROM products where product_uuid = ?";
            const [itemDetails] = await dbConnect.con.promise().query(command, [id]);

            if (itemDetails && itemDetails.length > 0) {
                return itemDetails[0];
            }
            else {  // Check for MySQL error
                const [error, _] = itemDetails;
                if (error) {
                    console.error("MySQL Error:", error);
                }
                return null; }

        } catch (error) {
            console.error("problem getting item details:", error);
            return null;
        }
    }

    async updatePrice(price, id) {
        const command = "UPDATE products SET price = ? WHERE id = UUID_TO_BIN(?)";
        const [newPrice] = await dbConnect.con.promise().query(command, [parseFloat(price), id]);
        try {
            if (newPrice && newPrice.length > 0) {
                console.log("Price successfully updated");
                return newPrice[0];
            }
            return null;
        } catch (error) {
            console.error("Problem updating the price:", error);
        }
    }
    


    async searchProducts(name) {
        const command = "SELECT * FROM products where name LIKE ?";
        const searchKeyword = `%${name}%`;
        try {
            const [products] = await dbConnect.con.promise().query(command, [searchKeyword]);
            if (products.length > 0) {
                return products[0];
            }
            return null;
        } catch (error) {
            console.error("problem getting product:", error);
            return null;
        }
    }

    async getHighestRatedProducts(limit) {
        const command = "SELECT * FROM products ORDER BY rating DESC LIMIT ?";
        try {
            const [products] = await dbConnect.con.promise().query(command, [parseInt(limit)]);
            if (products && products.length > 0) {
                return products;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting highest-rated products:", error);
            return null;
        }
    }


    async getProductsByPriceRange(minPrice, maxPrice) {
        const command = "SELECT * FROM products WHERE price BETWEEN ? AND ?";
        try {
            const products = await dbConnect.con.promise().query(command, [parseFloat(minPrice), parseFloat(maxPrice)]);
            return products;
        } catch (error) {
            console.error("Error getting products by price range:", error);
            return null;
        }
    }

    async getProductsInStock() {
        const command = "SELECT * FROM products WHERE quantity > 0";
        try {
            const products = await dbConnect.con.promise().query(command);
            return products[0];
        } catch (error) {
            console.error("Error getting products in stock:", error);
            return null;
        }
    }

    async sortProductsByPrice(ascending = true) {
        const order = ascending ? "ASC" : "DESC";
        const command = `SELECT * FROM products ORDER BY price ${order}`;
        try {
            const products = await dbConnect.con.promise().query(command);
            return products[0];
        } catch (error) {
            console.error("Error sorting products by price:", error);
            return null;
        }
    }

}


const productsController = new ProductsController();

module.exports = productsController;