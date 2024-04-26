var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var path = require('path');
var querystring = require('querystring');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var userController = require('../controllers/database.js');

router.get('/viewCart', userController.viewCart);
router.post('/updateCart', userController.updateCart);

router.get('/checkout', userController.checkOut);
router.post('/checkout', userController.saveOrder);

router.post('/storeTotal', userController.storeTotal);


module.exports = router;