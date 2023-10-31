const express = require("express");
const router = express.Router();


// GET: add a product to the shopping cart when "Add to cart" button is pressed

router.post("/add-item", async (req, res) => {
  const product = {
    productQty: parseInt(req.body.productQty),
    productId: req.body.productId,
    productPrice: parseFloat(req.body.productPrice),
    productImage: req.body.productImage,
    productTitle: req.body.productTitle,
  };

  const itemIndex = req.session.cart.items.findIndex(
    (item) => item.productId === product.productId
  );

  if (itemIndex > -1) {
    req.session.cart.items[itemIndex].productQty += product.productQty;
    req.session.cart.totalQty++;
    req.session.cart.totalCost += product.productPrice * product.productQty;
  } else {
    req.session.cart.items.push(product);
    req.session.cart.totalQty += product.productQty;
    req.session.cart.totalCost += product.productPrice * product.productQty;
  }

  res.redirect(req.headers.referer);
});

// GET: remove a product from the shopping cart when "Remove from cart" button is pressed
router.get("/removeItem/:id", (req, res) => {
  const productId = req.params.id;
  const itemIndex = req.session.cart.items.findIndex(
    (item) => item.productId == productId
  );

  if (itemIndex > -1) {
    // if product is found, reduce its qty
    const qty = req.session.cart.items[itemIndex].productQty;
    for (let i = 0; i < qty; i++) {
      req.session.cart.items[itemIndex].productQty--;
      req.session.cart.totalQty--;
      req.session.cart.totalCost -=
        req.session.cart.items[itemIndex].productPrice;
    }

    // if the item's qty reaches 0, remove it from the cart
    if (req.session.cart.items[itemIndex].productQty <= 0) {
      req.session.cart.items.splice(itemIndex, 1);
    }
  }
  res.redirect(req.headers.referer);
});

// GET: remove all items from the shoping cart when "Empty cart" button is pressed
router.get("/remove-all", (req, res) => {
  req.session.cart = {
    items: [],
    totalQty: 0,
    totalCost: 0,
  };
  res.redirect(req.headers.referer);
});

// POST: update all items from the shopping cart when "Update cart" button is pressed
router.post("/update", (req, res) => {
  // console.log(req.body);
  const products = req.body;
  products.map((product) => {
    const productId = parseInt(product.id);
    const productQty = parseInt(product.qty);
    const itemIndex = req.session.cart.items.findIndex(
      (item) => item.productId == productId
    );

    if (itemIndex > -1) {
      // if product is found, reduce its qty
      let existingQty = req.session.cart.items[itemIndex].productQty;
      if (existingQty > productQty) {
        while (existingQty > productQty) {
          req.session.cart.items[itemIndex].productQty--;
          req.session.cart.totalQty--;
          req.session.cart.totalCost -=
            req.session.cart.items[itemIndex].productPrice;

          existingQty--;
        }
      } else if (existingQty < productQty) {
        while (existingQty < productQty) {
          req.session.cart.items[itemIndex].productQty++;
          req.session.cart.totalQty++;
          req.session.cart.totalCost +=
            req.session.cart.items[itemIndex].productPrice;

          existingQty++;
        }
      }

      // if the item's qty reaches 0, remove it from the cart
      if (req.session.cart.items[itemIndex].productQty <= 0) {
        req.session.cart.items.splice(itemIndex, 1);
      }
    }
  });
  res.send("Cart updated successfully");
});

module.exports = router;
