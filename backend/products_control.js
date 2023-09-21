const Product = require('./products')


class ProductControl {
    
    async products_control(req, res) {
        const productId = req.params.productId;

        try {
            // Create an instance of the Product class with the user ID and product ID
            // The user ID is not used in your Product class, so you can omit it if not needed
            const newProduct = new Product(null, productId);

            // Fetch product details
            const productName = await newProduct.displayName();
            const productPrice = await newProduct.displayPrice();
            const productDescription = await newProduct.displayDescription();
            const productRating = await newProduct.displayRating();
            const productImageUrl = await newProduct.displayImage();

            // Return the product details as JSON
            returnres.json({
                name: productName,
                price: productPrice,
                description: productDescription,
                rating: productRating,
                image_url: productImageUrl,
            });
        } catch (error) {
            console.error('Error fetching product details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

const productControl = new ProductControl()

module.exports = productControl;