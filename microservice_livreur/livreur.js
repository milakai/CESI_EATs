const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const sql = require('mssql');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(express.json()); // to parse JSON request bodies
app.use(cors({
  origin: '*' // allow only this origin
}));

// MongoDB URI
const uri = "mongodb+srv://Tom:rHiNUmndV0MIzX3t@db0cluster0.scxfepc.mongodb.net/?authMechanism=DEFAULT";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// SQL Server configuration
const sqlConfig = {
  user: 'sa',
  password: 'Cesi_EATpwd!',
  server: 'localhost',
  database: 'CESI_EAT',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    enableIdentityInsert: true
  }
};

// Connect to SQL Server  
const connectSqlServerDB = async () => {
  try {
    await sql.connect(sqlConfig);
    console.log('Connected to SQL Server database');
  } catch (err) {
    console.log('Error connecting to the database:', err);
    process.exit(1);
  }
};

connectSqlServerDB();

const orderSchema = new mongoose.Schema({
    
   customerName: {
     type: String,
     required: true
   },
   totalPrice: {
     type: Number,
     required: true
   },
   items: {
     type: Array,
     required: true
   },
   createdAt: {
     type: Date,
     default: Date.now
   },
   status: {
     type: String,
     default: "En attente"
   },
   driverId: {
     type: String,
     ref: 'Driver' // assuming you have a Driver model
   },
  decision: {
    type: String,
    ref: 'Driver' // assuming you have a Driver model
  }
   // Autres propriétés du modèle de commande
 });

app.patch('/orders/:orderId/driver', async (req, res) => {

  const token = req.headers.authorization;
  const payload = jwt.decode(token)
  const driverId = payload._id;
  const userType = payload.type;
  const { decision } = req.body; // should be either 'accept' or 'refuse'
  const orderId = req.params.orderId;

  try {
    if(userType === 'driver'){
      let order;
      if(decision === 'accept'){
        
        order = await client.db('test').collection('orders').findOneAndUpdate(
          { _id: new ObjectId(orderId), status: 'En attente' },
          {
            $set: {
              status: 'En cours de livraison',
              driverId: driverId,
            },
          },
          { new: true }
          );
          
        }else{
          order = await client.db('test').collection('orders').findOneAndUpdate(
            { _id: new ObjectId(orderId), status: 'En attente' },
            {
                $addToSet: {
                    blacklist: driverId,
                },
            },
            { new: true }
        );
        
        }
        res.json(order);
    }else{
      res.status(403).send("Connectez vous en tant que livreur")
    }

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la commande' });
  }
});

const port = 3006;
app.listen(port, () => {
  console.log(`Le serveur Express écoute sur le port ${port}`);
});
