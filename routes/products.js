var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var path = require('path');
var querystring = require('querystring');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var userController = require('../controllers/products.js');

router.post('/', userController.productStorage);


//router.get('/account-made', userController.accountCreated);

module.exports = router;