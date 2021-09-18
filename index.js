
const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
require('dotenv').config();

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.slxtz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const bookingCollection = client.db("burjAlArab").collection("booking");

    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        bookingCollection.insertOne(newBooking)
        .then(result => {
            console.log(result);
        })
        console.log(newBooking);
    })

    app.get('/bookings', (req, res) => {
        bookingCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/confirmation/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        bookingCollection.find({ _id: id })
          .toArray((err, documents) => {
            res.send(documents[0]);
          })
      })
});
    
app.get('/', (req, res)=> {
    res.send("db is working!!");
})
app.listen(5000, () => console.log('listening to port 5000'));