const express = require('express')
const hbs = require('hbs')
var MongoClient = require('mongodb').MongoClient;
var Regex = require("regex");

const app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')
app.use(express.static(__dirname + '/public'));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var url = 'mongodb+srv://phuc:112233445566@cluster0.jxuk1.mongodb.net/test';

app.get('/', async(req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let result = await dbo.collection("products").find({}).toArray();
    res.render('index', { model: result })
})
app.get('/insert', (req, res) => {
    res.render('newProduct');
})
app.post('/doInsert', async(req, res) => {
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let colorInput = req.body.txtColor;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let newProduct = { productName: nameInput, price: priceInput, color: colorInput };
    await dbo.collection("products").insertOne(newProduct)

    res.redirect('/');
})
app.get('/search', (req, res) => {
    res.render('index');
})
app.post('/doSearch', async(req, res) => {
    let nameInput = req.body.txtName;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let result = await dbo.collection("products").find({ productName: { $regex: nameInput } }).toArray();
    res.render('index', { model: result })

})

app.get('/delete', async(req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    await dbo.collection('products').deleteOne({ "_id": ObjectID(id) })
    res.redirect('/');
})

app.get('/Edit', async(req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let result = await dbo.collection("products").findOne({ "_id": ObjectID(id) });
    res.render('editproduct', { model: result });
})
app.post('/doedit', async(req, res) => {
    let id = req.body.id;
    let name = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let inputcolor = req.body.txtColor;

    let newValues = { $set: { productName: name, price: priceInput, color: inputcolor } };
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    await dbo.collection("products").updateOne(condition, newValues);

    res.redirect('/');
})
var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("server is running")