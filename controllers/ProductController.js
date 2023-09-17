const dbConnect = require("../utils/mysql");
const productsController = require("../utils/products");
const product = require('../utils/products');

class ProductController {
    async addProduct(req, res) {
        const { name, description, price, quantity, image_url, rating } = req.body;
        if (!Number(quantity) || !Number(price)) {
            res.status(400).json({ message: "quantity and price must be integers" });
        }
        try {
            dbConnect.isAlive().then(async (isConnected) => {
                if (isConnected) {
                    const newProductId = await product.addNewProduct(name, description, price, quantity, image_url, rating);
                    if (newProductId !== null) {
                        return res.status(200).json({ message: "Product successfully added to db", newProductId });
                    }
                    return res.status(400).json({ message: "Problem encountered" });
                }
                else {
                    res.status(400).json({ message: "database connection issue" });
                }
            });
        } catch (err) {

        }
    }

    //this feature doesn't work correctly yet
    async getItem(req, res) {
        try {
            const {product_uuid} = req.params.product_uuid;
            if (!product_uuid) {
                return res.status(400).json({ message: "Enter a valid uuid" });
            }

            const isConnected = await dbConnect.isAlive();
            if (!isConnected) {
                return res.status(500).json({ message: "Problem connecting to the database" });
            }
            const [item] = await product.getItemDetails(product_uuid);
            console.log(item);
            if (!item) {
                return res.status(400).json({ message: "No such item" });
            }
            return res.status(200).json(item);
        } catch (error) {
            console.error("Error in getItem:", error);
            return res.status(400).json({ message: "Problem getting item" });
        }
    }

    //this is still having return issues
    async updatePriceHandler(req, res) {
        try {
            const {price} = req.body;
            const {product_id} = req.params;

            if (!product_id) {
                console.error("No such product");
                return res.status(400).json({ message: "No such product" });
            }
            const updatedProduct = await product.updatePrice(price, product_id);
            
            if (updatedProduct) {
                return res.status(200).json(updatedProduct);
            } else {
                console.error("No product found to update");
                return res.status(404).json({ message: "No product found for update" });
            }
        } catch (error) {
            console.error("Fatal Error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    

    async searchProduct(req, res) {
        try {
            const {keyword} = req.query.name;
            if (!keyword) {
                return res.status(400).json({ message: "No record of item", keyword });
            }

            const decodedKeyword = decodeURIComponent(keyword);
            const result = await product.searchProducts(decodedKeyword);
            console.log(result);
            if (!result) {
                return res.status(400).json({ message: "Item not found" });
            } else {
                return res.status(200).json({ result });
            }
        } catch (error) {
            res.status(400).json({ message: "Error searching for item" });
        }
    }

    async getHighestRating(req, res) {
        try {
            const {rating} = req.params.rating;
            if (!rating) {
                return res.status(400).json({ message: "no such id" });
            }
            const foundRatings = await product.getHighestRatedProducts(rating);
            console.log(foundRatings);
            if (foundRatings) {
                return res.status(200).json({ foundRatings })
            }
            else {
                return res.status(400).json({ message: "no products found with that rating" });
            }
        } catch (error) {
            res.status(500).send();
        }
    }


    async getPriceRange(req, res) {
        try {
            const { min, max } = req.params;

            if (!Number(min) || !Number(max)) {
                return res.status(400).json({ message: "Please enter valid numbers for min and max" });
            }
            const isConnected = await dbConnect.isAlive();
    
            if (!isConnected) {
                console.error("Problem connecting to the database");
                return res.status(500).json({ message: "Database connection problem" });
            }
            const [receivedPrices] = await product.getProductsByPriceRange(Number(min), Number(max));
    
            if (receivedPrices && receivedPrices.length > 0) {
                return res.status(200).json( receivedPrices );
            } else {
                return res.status(404).json({ message: "No products found in the specified price range" });
            }
        } catch (error) {
            console.error("Failure encountered:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getPricesInAsc(req, res) {
        try {
            const products = await product.sortProductsByPrice(true);// true for ascending order
            if (products && products.length > 0) {
                return res.status(200).json({ products });
            } else {
                return res.status(404).json({ message: "No products found" });
            }
        } catch (error) {
            console.error("Error in getPricesInAsc:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    
}

const productController = new ProductController();

module.exports = productController;