var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var path = require('path');
var querystring = require('querystring');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

var userController = require('../controllers/database.js');

router.post('/create-account', userController.saveNewUser);
/*router.post('/create-account', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Insert user creation logic here...

        // On success, render the account created page
        res.render('account-made', { firstName: firstName });
    } catch (error) {
        // Handle errors, possibly render an error page
        res.status(500).send("Error creating account: " + error.message);
    }
});
*/
//router.get('/account-made', userController.accountCreated);

module.exports = router;