const mongoose =require('mongoose')
//"mongodb://localhost:27017/project_2"  -> could also be used for local host
mongoose.connect("mongodb+srv://imeza2:g4H8s486UqNqapSc@cluster0.qoreviv.mongodb.net/project_2")

    //try to connect
.then (()=> {
console.log('mongodb connected')

})
.catch(()=>{
    console.log('error')
})

//create object to pass info
const objInfo = new mongoose.Schema({
    email:{ type:String},
    firstname:{type:String},
    lastname:{type:String},
    address:{type:String},
    city:{type:String},
    state:{type:String},
    zip:{type:String},
    shippingMethod:{type:String}

})

//orders = name of collection inside project 2. "objInfo" is being passed to it
const userCollection = new mongoose.model('orders', objInfo)

//change hard set values to get them from frontend
orderdata={
    email: "dany@gmail.com",
    firstname: "daniel",
    lastname: "franco",
    address: "25800 Carlos Bee Blvd",
    city:"Hayward",
    state: "CA",
    zip:"94588",
    shippingMethod: "7-9 Business Days: $0.00"
}

//push the data into mongodb
userCollection.insertMany([orderdata])
