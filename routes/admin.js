const path = require('path');

const express = require('express');
const {body} = require('express-validator/check');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

//request is funneled through left to right from one middleware to another provied in the argument
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', [], isAuth,adminController.postAddProduct);
router.get('/products', isAuth,adminController.getProducts);
router.get('/edit-product/:productId', isAuth,adminController.getEditProduct);

router.post('/edit-product', [
    body('title').isString().isLength({min: 3})//is Alphanumeric shall not work in case whitspace involved
    .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({min: 8, max: 400})
    .trim(),
],isAuth,adminController.postEditProduct);

router.get('/add-product', isAuth,adminController.getAddProduct);

router.post('/add-product', [
    body('title').isString().isLength({min: 3})//is Alphanumeric shall not work in case whitspace involved
    .trim(),
    body('price').isFloat(),
    body('description').isLength({min: 8, max: 400})
    .trim(),
],isAuth,adminController.postAddProduct);
router.post('/delete-product', isAuth,adminController.postDeleteProduct);

module.exports = router;
