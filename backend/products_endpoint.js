const ProductDetails = require('./products');

class ProductEndPoint {
  async productEndPoint(req, res) {
    const { product_id } = req.params;

    try {
      console.log(product_id);

      const productInstance = new ProductDetails(product_id);

      // Fetch all properties asynchronously
      const product_id = await productInstance.product_uuid('product_uuid');
      const productName = await productInstance.getProperty('name');
      const productPrice = await productInstance.getProperty('price');
      const productDescription = await productInstance.getProperty('description');
      const productRating = await productInstance.getProperty('rating');
      const productImageUrl = await productInstance.getProperty('image_url');

      // Create an object with all properties
      const productData = {
        product_uuid: product_id,
        name: productName,
        price: productPrice,
        description: productDescription,
        rating: productRating,
        image_url: productImageUrl,
      };

      
      res.json(productData);
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

const aProductEndPoint = new ProductEndPoint();

module.exports = aProductEndPoint;
