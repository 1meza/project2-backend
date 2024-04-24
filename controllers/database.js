var { uri } = require('./databaseConnection');

const { MongoClient, ServerApiVersion } = require('mongodb');

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
    var value_firstName = req.body.name;
    var value_email = req.body.email;

    console.log("NEW User Data  " + value_firstName + "  email: " + value_email);

    saveUserToMongoDB(value_firstName, value_email);

    res.redirect('https://csweb01.csueastbay.edu/~rc3325/group_project_2/account-created.html')
    //res.send("Welcome,  " + value_firstName + "</br> We will reach you at: " + value_email);

};

async function saveUserToMongoDB(name, email) {
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


        // check if the user already exists (with this email)
        const query = { email: email };
        const userExists = await users.findOne(query);
        if (userExists) {
            console.log("User with email " + email + " already exists");
            return;
        }

        // insert the new user and display in console the new # documents in users
        const user = { name: name, email: email };
        const result = await users.insertOne(user);
        console.log("New user created with the following id: " + result.insertedId);
        console.log("# documents in it " + await users.countDocuments());



    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

