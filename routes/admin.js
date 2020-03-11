const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

//request is funneled through left to right from one middleware to another provied in the argument
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth,adminController.postAddProduct);
router.get('/products', isAuth,adminController.getProducts);
router.get('/edit-product/:productId', isAuth,adminController.getEditProduct);
router.post('/edit-product', isAuth,adminController.postEditProduct);
router.get('/add-product', isAuth,adminController.getAddProduct);
router.post('/add-product', isAuth,adminController.postAddProduct);
router.post('/delete-product', isAuth,adminController.postDeleteProduct);

module.exports = router;
