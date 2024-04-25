var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var path = require('path');
var querystring = require('querystring');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var userController = require('../controllers/database.js');

router.post('/create-account', userController.saveNewUser);

router.post('/account', userController.accountLogin);

router.post('/logout', userController.logout);

//router.get('/account-made', userController.accountCreated);

module.exports = router;