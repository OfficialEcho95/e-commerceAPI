const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const productController = require('../controllers/ProductController');
const orderedItems = require('../controllers/OrderedItems');
const checkout = require('../controllers/OrdersController')
const register = require('../backend/register');
const login = require('../backend/login');
const prod = require('../backend/products_endpoint')


router.get('/status', AppController.getStatus);
router.post('/user', UsersController.postNew);
router.delete('/remove', UsersController.deleteUser);
router.post('/update', UsersController.updateUser);
router.get('/user/:email', UsersController.getUserDetails);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.post('/addProduct', productController.addProduct);
router.get('/item/:productId', productController.getItem);
router.get('/search', productController.searchProduct);
router.get('/highRating/:rating', productController.getHighestRating);
router.get('/priceRange/:min/:max', productController.getPriceRange);
router.get('/prices-in-asc', productController.getPricesInAsc);
router.put('/update-price/:product_id', productController.updatePriceHandler);
router.get('/allItems', productController.getAllItemHandler);

// Cart Routes
router.post('/addItem', orderedItems.addItemHandler);
router.get('/cart/:user_id', orderedItems.getItemsHandler);
router.delete('/remove-item', orderedItems.deleteItemHandler);
router.get('/item-by-id', orderedItems.getItemByIdHandler);
router.put('/updateItem', orderedItems.updateItemHandler);

// Checkout Routes
router.post('/createOrder', checkout.createOrderHandler);
router.get('/user-history/:user_id', checkout.orderByUserIdHandler);
router.get('/user-cart', checkout.orderDetailsHandler);
router.put('/status-update/:order_id', checkout.updateOrderStatusHandler);
router.put('/cancel-order/:order_id', checkout.cancelOrderHandler);
router.delete('/delete-order/:order_id', checkout.deleteOrderHandler);

//from frontend
router.post('/signup', register.registerUser);
router.post('/login', login.loginUser);
router.get('/AProduct/:product_id', prod.productEndPoint);

module.exports = router;