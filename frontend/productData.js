async function fetchProductDetails(productId) {
    try {
      const response = await fetch(`/product/${productId}`);
      if (!response.ok) {
        throw new Error(`Error fetching product details: ${response.status}`);
      }
      const productData = await response.json();
      return productData;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  async function displayProductDetails() {
    const productId = '01c418da-1c19-4c3a-8f0a-d4a63029abfd';
  
    const productNameElement = document.getElementById('product-name');
    const productPriceElement = document.getElementById('product-price');
    const productDescriptionElement = document.getElementById('product-description');
    const productRatingElement = document.getElementById('product-rating');
    const productImageElement = document.getElementById('product-image');
  
    const productDetails = await fetchProductDetails(productId);
  
    if (productDetails) {
      productNameElement.textContent = productDetails.name;
      console.log(productDetails.name);
      productPriceElement.textContent = productDetails.price;
      productDescriptionElement.textContent = productDetails.description;
      productRatingElement.textContent = productDetails.rating;
      productImageElement.src = productDetails.image_url;
    } else {
      // Handle error or display a message if the product details couldn't be fetched
      console.error('Product details not available');
    }
  }
  
  // Call the function to display product details when the page loads
  window.addEventListener('load', displayProductDetails);
  

module.exports = fetchProductDetails;