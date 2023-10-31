const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const https = require("https");

const product = require('../utils/products');

// HOME PAGE
router.get("/index", (req, res) => {
  res.redirect("/");
});
router.get("/", async (req, res) => {
  const cart = req.session.cart;
  const products = await product.getAllItems().then(res => {
    return res.slice(0, 16);
  })
  .catch((err) => {
    if (err)
      res.status(400).redirect("/error");
  });;
  res
    .status(200)
    .render("index", { pageName: "Home", products, cart });
});

// ALL PRODUCTS PAGE
router.get("/product", async (req, res) => {
  const cart = req.session.cart;
  const products = await product.getAllItems().then((data) => {
    return data;
  })
  .catch((err) => {
    if (err)
      res.status(400).redirect("/error");
  });

  res
    .status(200)
    .render("product", { pageName: "Product", products, cart });
});

router.get("/product-detail", (req, res) => {
  res.redirect("/");
});

router.get("/product-detail/:id", async (req, res) => {
  const cart = req.session.cart;
  const item = await product.getItemDetails(req.params.id);
  const relatedProducts = await product.getAllItems()
    .then((data) => {
      return data.sort(() => Math.random() - 0.5).slice(0, 8);
    });
  res.status(200).render("product-detail", {
    pageName: "View Product",
    product: item,
    relatedProducts,
    cart,
    addToCart,
  });
});

// AUTHENTICATIONS
router.get("/login", middleware.userNotLoggedIn, (req, res) => {
  const cart = req.session.cart;
  const successMsg = req.flash("success");
  const errorMsg = req.flash("error");
  res
    .status(200)
    .render("login", { pageName: "Login", cart, errorMsg, successMsg });
});

router.get("/register", middleware.userNotLoggedIn, (req, res) => {
  const successMsg = req.flash("success");
  const errorMsg = req.flash("error");
  const cart = req.session.cart;
  res
    .status(200)
    .render("register", { pageName: "Register", cart, errorMsg, successMsg });
});
router.get("/forgot_password", middleware.userNotLoggedIn, (req, res) => {
  const cart = req.session.cart;
  res
    .status(200)
    .render("forgot_password", { pageName: "Forgot Password", cart });
});

router.get("/dashboard", middleware.userIsLoggedIn, (req, res) => {
  const cart = req.session.cart;
  res.status(200).render("dashboard", { pageName: "Dashboard", cart });
});

// OTHER PAGES
router.get("/contact", (req, res) => {
  const cart = req.session.cart;
  res.status(200).render("contact", { pageName: "Contact", cart });
});

router.get("/about", (req, res) => {
  const cart = req.session.cart;
  //   console.log(req.session);
  res.status(200).render("about", { pageName: "About", cart });
});

router.get("/error", (req, res) => {
  const cart = req.session.cart;
  res.status(200).render("error", { pageName: "Error", cart });
});

// SHOPPING CART

router.get("/shopping-cart", (req, res) => {
  const cart = req.session.cart;
  res.status(200).render("shopping-cart", { pageName: "Shopping Cart", cart });
});

router.get("/checkout", middleware.userIsLoggedIn, (req, res) => {
  const cart = req.session.cart;
  if (cart.items.length <= 0) {
    res.redirect("/shopping-cart");
  } else {
    res.status(200).render("checkout", { pageName: "Checkout", cart });
  }
});

// PAYSTACK PAYMENT GATEWAY
router.post("/paystack", middleware.userIsLoggedIn, (req, res) => {
  console.log(req.body);
  const params = JSON.stringify({
    email: req.body.email,
    amount: req.body.amount * 100,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
      "Content-Type": "application/json",
    },
  };

  const paystack_request = https
    .request(options, (paystack_response) => {
      let data = "";

      paystack_response.on("data", (chunk) => {
        data += chunk;
      });

      paystack_response.on("end", () => {
        res.redirect(JSON.parse(data).data.authorization_url);
      });
    })
    .on("error", (error) => {
      console.error(error);
    });

  paystack_request.write(params);
  paystack_request.end();
});

// SHOPPING CART FUNCTIONS
const addToCart = (id, qty, img, price, title) => {
  const product = {
    productQty: parseInt(qty),
    productId: parseInt(id),
    productPrice: parseFloat(price),
    productImage: img,
    productTitle: title,
  };

  const itemIndex = req.session.cart.items.findIndex(
    (item) => item.productId === product.productId
  );

  if (itemIndex > -1) {
    req.session.cart.items[itemIndex].productQty += 1;
    req.session.cart.totalQty++;
    req.session.cart.totalCost += product.productPrice;
  } else {
    req.session.cart.items.push(product);
    req.session.cart.totalQty++;
    req.session.cart.totalCost += product.productPrice;
  }

  res.cookie("cart", JSON.stringify(req.session.cart));
};

module.exports = router;
