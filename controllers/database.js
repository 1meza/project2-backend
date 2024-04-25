var { uri } = require('./databaseConnection');

const { MongoClient, ServerApiVersion } = require('mongodb');
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

    //shipment info
    var shipmentInfo  = {
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        shipping_method: req.body.shipping_method
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
// module.exports.login = function(req, res, next) {
//     var email = req.body.email;
//     var password = req.body.password;
//
//         console.log("Login attempt with email: " + email);
//
//         authenticateUser(email, password);
//
//     };

// authenticate user
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
        // log the collection
        console.log("Collection is " + users.collectionName);
        // log the number of documents in the collection
        console.log("# documents in it " + await users.countDocuments());

        // check if the user exists (with this email and password)
        const query = { email: email, pw: password };
        const userExists = await users.findOne(query);
        if (userExists) {
            console.log("User with email " + email + " exists");
            return query;
        } else {
            console.log("User with email " + email + " does not exist");
            return null;
        }

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

