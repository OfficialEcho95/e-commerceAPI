/**
 * This module adds functionality to the index page
 */

async function fetchData() {
    try {
      const allItems = await fetch('http://localhost:3000/allItems')
        .then((response) => response.json())
        .catch((error) => console.error('Error fetching data:', error));

      if (Array.isArray(allItems)) {
        // Call the function to create and display product elements
        createProductElements(allItems);
      } else {
        console.error('Invalid API response:', allItems);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // function to create product elements and append them to the DOM
  function createProductElements(data) {
    const imageContainer = document.getElementById('image-container');
    
    //row element
    let currentRow = document.createElement('div');
    currentRow.className = 'row';

    data.forEach((item, index) => {
      //single product element
      const productElement = document.createElement('div');
      productElement.className = 'col-md-6 single-products-catagory clearfix';

      //link element
      const linkElement = document.createElement('a');
      linkElement.href = 'shop.html';

      // Create an image element
      const imgElement = document.createElement('img');
      imgElement.src = item.image_url;
      imgElement.alt = item.name;

      // paragraph element for name
      const nameElement = document.createElement('h4');
      nameElement.textContent = item.name;

      // paragraph element for price
      const priceElement = document.createElement('p');
      priceElement.textContent = `From $${item.price}`;

      // Append elements to their respective parents
      linkElement.appendChild(imgElement);
      linkElement.appendChild(nameElement);

      productElement.appendChild(linkElement);
      productElement.appendChild(priceElement);

      // Append the product element to the current row
      currentRow.appendChild(productElement);

      // Add the current row to the container and start a new row if needed
      if ((index + 1) % 2 === 0 || index === data.length - 1) {
        imageContainer.appendChild(currentRow);
        currentRow = document.createElement('div');
        currentRow.className = 'row';
      }
    });
  }

  fetchData();
