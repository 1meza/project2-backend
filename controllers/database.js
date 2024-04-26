var { uri } = require('./databaseConnection');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const {request} = require("express");

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

module.exports.saveNewUser = function(req, res, next) {

    var body = JSON.stringify(req.body);
    var params = JSON.stringify(req.params);
    var firstName = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var billingInfo = {
        address_1: req.body.address_1,
        address_2: req.body.address_2,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        phone: req.body.phone
    };

    console.log("NEW User Data  " + firstName + "  email: " + email);

    saveUserToMongoDB(firstName, email, password, billingInfo);

    res.render('account-made', { name: firstName });
    //res.redirect('https://csweb01.csueastbay.edu/~rc3325/group_project_2/account-created.html')
    //res.send("Welcome,  " + value_firstName + "</br> We will reach you at: " + value_email);

};


async function saveUserToMongoDB(name, email, password, billingInfo) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // connect to the database "project_2"
        const database = client.db("project_2");
        // grab the collection "users"
        const users = database.collection("users");
        // grab the collection "billing"
        const billing = database.collection("billing");
        // log the collection
        console.log("Collection is " + users.collectionName);
        // log the number of documents in the collection
        console.log("# documents in it " + await users.countDocuments());


        // check if the user already exists (with this email)
        const query = { email: email };
        const userExists = await users.findOne(query);
        if (userExists) {
            console.log("User with email " + email + " already exists");
            return;
        }

        // insert the new user and display in console the new # documents in users
        const user = { name: name, email: email, pw: password };
        const result = await users.insertOne(user);
        console.log("New user created with the following id: " + result.insertedId);
        console.log("# documents in it " + await users.countDocuments());

        // insert the information into the billing collection associated with the user
        billingInfo.user_id = result.insertedId;
        const billingResult = await billing.insertOne(billingInfo);
        console.log("New billing info created with the following id: " + billingResult.insertedId);


    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// login function
module.exports.accountLogin = async function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

        console.log("Login attempt with email: " + email);

        var user  = await authenticateUser(email, password);

        if (user != null){
            // store the user in the session
            req.session.user = user;
            // if the user is valid, redirect to the home page
            res.render('account', { name: user.name })
        }
        else{
            // if the user is not valid, redirect to the csweb01 page with an error message
            res.redirect('https://csweb01.csueastbay.edu/~rc3325/group_project_2/account.html' + "?error=invalid_login_credentials");

        }


    };

// authenticate+ user
async function authenticateUser(email, password) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // connect to the database "project_2"
        const database = client.db("project_2");
        // grab the collection "users"
        const users = database.collection("users");

        // retrieve the user with the given email
        const query = { email: email };
        const user = await users.findOne(query);
        if (!user) {
            console.log("User with email " + email + " does not exist");
            return null;
        }

        // check if the password is correct
        if (user.pw === password) {
            console.log("User with email " + email + " authenticated");
            return user;
        } else {
            console.log("User password does not match");
            return null;
        }


    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// logout function
module.exports.logout = function(req, res) {
    // destroy the session
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        // redirect to the csweb01 page
        res.redirect('https://csweb01.csueastbay.edu/~rc3325/group_project_2/account.html');
    });
};


// view cart function
module.exports.viewCart = function (req, res, next) {
    // check if the cart is empty
    if (!req.session.cart) {
        res.render('cart', { cart: [] });
    } else {
        res.render('cart', { cart: req.session.cart });
    }
};

// update cart function
module.exports.updateCart = function (req, res, next) {
    var product_id = req.body.product_id;
    var quantity = req.body.quantity;

    var existingProductIndex = req.session.cart.findIndex(item => item.product_id === product_id);
    if (existingProductIndex > -1) {
        // Product exists, update quantity
        req.session.cart[existingProductIndex].quantity += parseInt(quantity);
    }
}

// checkout function
module.exports.checkOut = function (req, res, next) {
    // check if the user is logged in
    if (!req.session.user) {
        res.redirect('https://csweb01.csueastbay.edu/~rc3325/group_project_2/account.html');
    } else {
        res.render('checkout', { user: req.session.user, cart: req.session.cart });
    }
}

// save order information
module.exports.saveOrder = function (req, res, next) {
    var order = {
        user_id: req.session.user._id,
        products: req.session.cart,
        total: req.session.total,
        shipping: req.body.shipping,
        grand_total: req.session.grand_total
    };

    var shippingInfo = {
        user_id: req.session.user._id,
        email: req.body.email,
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        address: req.body.address_1 + " " + req.body.address_2,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        shipping_method: req.body.shipping_method
    };

    var billingInfo = {
        user_id: req.session.user._id,
        address_1: req.body.address_1,
        address_2: req.body.address_2,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        phone: req.body.phone
    };


    //console.log("Order data: " + order);

    saveOrderToMongoDB(order, shippingInfo, billingInfo);

    res.render('storeOrder', { order: order, shippingInfo: shippingInfo, billingInfo: billingInfo});
}

module.exports.storeTotal = function (req, res, next) {
    var total = req.body.total;

    req.session.grand_total = total;

    res.end();

}

//function to save order information to mongo
async function saveOrderToMongoDB(order, shippingInfo, billingInfo) {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // connect to the database "project_2"
        const database = client.db("project_2");
        // grab the collection "users"
        const users = database.collection("users");
        // grab the collection "orders"
        const orders = database.collection("orders");
        // grab the collection "shipping"
        const shipping = database.collection("shipping");
        // grab the collection "billing"
        const billing = database.collection("billing");

        // insert the order into the orders collection
        const result = await orders.insertOne(order);
        console.log("Order created with the following id: " + result.insertedId);

        // insert the shipping information into the shipping collection associated with the user
        shippingInfo.order_id = result.insertedId;
        const shippingResult = await shipping.insertOne(shippingInfo);
        console.log("New shipping info created with the following id: " + shippingResult.insertedId);

        // insert the billing information into the billing collection associated with the user
        billingInfo.order_id = result.insertedId;
        const billingResult = await billing.insertOne(billingInfo);
        console.log("New billing info created with the following id: " + billingResult.insertedId);

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}


//get shipping information
module.exports.saveShipping = function (userInput) {
    var email = userInput.email;
    var firstName = userInput.first_name;
    var lastName = userInput.last_name;
    var address = userInput.address;
    var city = userInput.city;
    var state = userInput.state;
    var zipCode = userInput.zip_code;
    var shippingMethod = userInput.shipping_method;

    var shippingInfo = {
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        shipping_method: req.body.shipping_method
    };

    //display on console
    console.log("shipment info: " + shippingInfo);
    //call function to upload to mongodb
    saveShippingToMongoDB(shipmentInfo);

    return shippingInfo;
}

//function to save Shipping information to mongo
async function saveShippingToMongoDB(userInput) {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // connect to the database "project_2"
        const database = client.db("project_2");
        // grab the collection "users"
        const users = database.collection("users");
        // grab the collection "shipping"
        const shipping = database.collection("shipping");


        // insert the new user into the shipping collection
        const shipment = { userInput};
        const result = await users.insertOne(shipment);
        console.log("shipment is teh following: " + result.insertedId);

        // insert the shipping information into the shipping collection associated with the user
        const shippingInfo = saveShipping(userInput);
        shippingInfo.user_id = result.insertedId;
        const shippingResult = await shipping.insertOne(shippingInfo);
        console.log("New shipping info created with the following id: " + shippingResult.insertedId);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

