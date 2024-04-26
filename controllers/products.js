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

module.exports.productStorage = function(req, res, next) {
    var body = JSON.stringify(req.body);
    var params = JSON.stringify(req.params);
    var product_id = req.body.product_id;
    var quantity = req.body.quantity;
    var price = req.body.price;
    var product_number = req.body.product_page_number;

    console.log("Product Data  " + product_id + "  quantity: " + quantity);

    // add to express-session
    req.session.product_id = product_id;
    req.session.quantity = quantity;
    req.session.total = quantity * price;

    // save to MongoDB
    saveProductToMongoDB(product_id, quantity, quantity * price);

    // redirect to the csweb01 product page with the product_id
    res.redirect('https://csweb01.csueastbay.edu/~rc3325/group_project_2/products/' + product_number);

}

async function saveProductToMongoDB(product_id, quantity, total) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // connect to the database "project_2"
        const database = client.db("project_2");
        // grab the collection "products"
        const products = database.collection("products");
        // grab the collection "billing"
        //const billing = database.collection("billing");
        // log the collection
        console.log("Collection is " + products.collectionName);
        // log the number of documents in the collection
        console.log("# documents in it " + await products.countDocuments());

        // insert a document
        const p = await products.insertOne({
            product_id: product_id,
            quantity: quantity,
            total: total
        });
        // log the document
        console.log(p);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}