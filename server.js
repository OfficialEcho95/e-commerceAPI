const express = require('express');
const app = express();
const path = require('path'); // Node.js path module
const port = 3000;
const routes = require('./routes/index');
const cors = require('cors');
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


// Set Cookie Parser, session and flash
app.use(cookieParser("cookieSecretString"));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 1000 * 60 * 3, //session expires after 3 hours
      secure: false,
    },
  })
);
app.use(flash());

// Create cart on initialization
app.use(async (req, res, next) => {
  try {
    if (!req.session.cart) {
      req.session.cart = {
        items: [],
        totalQty: 0,
        totalCost: 0,
      };
    }
    next();
  } catch (err) {}
});

// Middleware to set login state using res.locals
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.token ? true : false;
  res.locals.token = req.session.token || null;
  next();
});


const pagesRouter = require("./routes/pages");
const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");

app.use('/api/v1', routes);
app.use("/", pagesRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);

app.listen(port, () => {
  console.log('Server listening on:', port);
});
