const express = require("express");
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT
} = require("./config/config");

//const qRouter = require("./routes/quoteRoutes")

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

MongoClient.connect(mongoURL, {
    useUnifiedTopology: true
  })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({
      extended: true
    }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    // ========================
    // Routes
    // ========================
    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(quotes => {
          res.render('pages/index.ejs', {
            quotes: quotes
          })
        })
        .catch( /* ... */ )
    })

    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate({
          name: 'Yoda'
        }, {
          $set: {
            title: req.body.name,
            body: req.body.body
          }
        }, {
          upsert: true
        })
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })


    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name : req.body.name}
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete2')
          }
          res.json('Deleted Darth Vadar\'s quote')
        })
        .catch(error => console.error(error))
    })


    // ========================
    // Listen
    // ========================
    const isProduction = process.env.NODE_ENV === 'production'
    const port = isProduction ? 7500 : 3000
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)