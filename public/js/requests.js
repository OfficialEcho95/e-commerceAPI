const displayProductsHome = async () => {
  let products = "";
  await axios
    .get("https://api.escuelajs.co/api/v1/products")
    .then((res) => {
      let sortedData = res.data.slice(0, 16);
      // let sortedData = res.data.sort((a, b) => b.id - a.id).slice(0, 16);

      sortedData.map((product) => {
        products += `
        <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item">
            <!-- Block2 -->
            <div class="block2">
              <div class="block2-pic hov-img0">
                <img src=${product.images[0]} alt="IMG-PRODUCT" />

                <a
                  href="product-detail.html?id=${product.id}"
                  class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                >
                  View Item
                </a>
              </div>

              <div class="block2-txt flex-w flex-t p-t-14">
                <div class="block2-txt-child1 flex-col-l">
                  <a
                    href="product-detail.html?id=${product.id}"
                    class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                  >
                    ${product.title}
                  </a>

                  <span class="stext-105 cl3"> $${product.price} </span>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      document.querySelector(".isotope-grid").innerHTML = products;
      document.querySelector(".isotope-grid").classList.add("row");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

displayProductsHome();
