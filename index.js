const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const port = process.env.PORT || 8550

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpujg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const transactionsHistory = client.db("uiChat_wallet").collection("transactionHistory");
  const Accounts = client.db("uiChat_wallet").collection("Accounts");
  const Balance = client.db("uiChat_wallet").collection("Balance");

  console.log('db connected');
  
  // Transaction get and post api....

  app.post('/addTransactionHistory', (req, res) => {
    const newTransactionHistory = req.body;
    transactionsHistory.insertOne(newTransactionHistory)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
  })

  app.get('/transaction', (req, res) => {
    transactionsHistory.find()
    .toArray((err, transaction) => {
        res.send(transaction)
    })
  })

  app.get('/transaction/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    transactionsHistory.find(id)
    .toArray((err, transaction) => {
      res.send(transaction)
    })
  })

  app.post('/depositBalance', (req, res) => {
    const balances = req.body;
    console.log(balances)
    Balance.insertOne(balances)
    .then(result => {
      console.log("data added successfully", result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/balance', (req, res) => {
    Balance.find()
    .toArray((err, balance) => {
        res.send(balance)
    })
  })

  app.post('/AddAccount', (req, res) => {
    const newAccount = req.body;
    console.log(newAccount)
    Accounts.insertOne(newAccount)
    .then(result => {
      console.log("data added successfully", result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/userAccount', (req, res) => {
    Accounts.find()
    .toArray((err, userAccount) => {
        res.send(userAccount)
    })
  })

})

app.listen(port)