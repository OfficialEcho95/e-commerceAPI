// Function to fetch and display product details
const productId = '';

async function displayProductDetails() {
  try {
    // Make a fetch request to the server's endpoint
    const response = await fetch(`http://localhost:3000/AProduct/${productId}`);

    if (response.status === 404) {
      console.error('Product not found');
      return;
    }

    const productData = await response.json();

    console.log(productData);
    // Populate HTML elements with product data
    
    document.getElementById('product-name').textContent = productData.name;
    document.getElementById('product-price').textContent = `$${productData.price}`;
    document.getElementById('product-description').textContent = productData.description;
    document.getElementById('product-image').src = productData.image;
    //document.getElementById('product-description').textContent = productData.description;

  } catch (error) {
    console.error('Error fetching product details:', error);
  }
}

// Call the function to display product details when the page loads
document.addEventListener('DOMContentLoaded', displayProductDetails);
