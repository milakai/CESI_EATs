const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient } = require('mongodb');

app.use(cors());

const mongodbUrl = 'mongodb+srv://JV:Sbl3Apu1eAY3Qx5F@db0cluster0.scxfepc.mongodb.net/';
const client = new MongoClient(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB établie');
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB', error);
  });

  const orderSchema = new mongoose.Schema({
    
   /* orderId: {
      type: String,
      required: true
    },*/
    customerName: {
      type: String,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    blacklist: {
      type: [String],
      required: true,
      default:[]
    },
    items: {
      type: Array,
      required: true
    }, 
    restaurant: {
      type: String,
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
    }
    // Autres propriétés du modèle de commande
  });
  
  

const Order = mongoose.model('Order', orderSchema);
async function getOrderDetailsHandler(req, res) {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }

    res.json(order);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la commande', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Gestionnaire pour la création d'une nouvelle commande
app.post('/orders', createOrderHandler);

// Gestionnaire pour la modification d'une commande
app.put('/orders/:orderId', updateOrderHandler);

//Gestionnaire pour la suppresion d'une commande
app.delete('/orders/:orderId', deleteOrderHandler);

// Gestionnaire pour la suppression d'une commande
async function deleteOrderHandler(req, res) {
  const orderId = req.params.orderId;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }

    res.json({ message: `Commande avec l'ID ${orderId} supprimée` });
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la commande' });
  }
}
// Gestionnaire pour la mise à jour du statut d'une commande
// app.patch('/orders/:orderId/status', updateOrderStatusHandler);

app.patch('/orders/:orderId/status', updateOrderStatusHandler);

// Gestionnaire pour récupérer les détails d'une commande
app.get('/orders/:orderId', getOrderDetailsHandler);

app.get('/orders', getAllOrders);

app.get('/order-history', getUserOrders);


// Gestionnaire par défaut pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestionnaire d'erreur global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Gestionnaire pour la création d'une nouvelle commande
async function createOrderHandler(req, res) {
  // Récupérer les données de req.body

  const { totalPrice, items } = req.body;
  const token = req.headers.authorization;

  const payload = jwt.decode(token)
  const userId = payload._id;
  // Valider les données reçues
  if (!totalPrice || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Données de commande invalides' });
  }
  const user = await client.db('CESI_EAT').collection('Users').findOne(
    { ID: userId },
    { projection: { firstName: 1 } }
  );
  const menuNames = items.map((item) => item.name);
  const menuNamesString = menuNames.join(', ').toString();
  console.log(menuNamesString);
  
  const restaurantName = await client.db('test_Nike').collection('menus').findOne(
    { nomMenu: menuNamesString },
    { projection: { restaurant: 1 } }
    );
  console.log(restaurantName.restaurant)

  // Créer un nouvel objet Order avec les données reçues
  const newOrder = {
    userId: userId,
    customerName: user.firstName,
    totalPrice: totalPrice,
    items: items,
    restaurant: restaurantName.restaurant

  };

  // Enregistrer la nouvelle commande dans la base de données
  Order.create(newOrder)
    .then((createdOrder) => {
      res.status(201).json(createdOrder);
    })
    .catch((error) => {
      console.error('Erreur lors de la création de la commande', error);
      res.status(500).json({ message: 'Erreur serveur lors de la création de la commande' });
    });
}


// Gestionnaire pour la mise à jour du statut d'une commande
function updateOrderStatusHandler(req, res) {
  const orderId = req.params.orderId;
  const { status } = req.body;

  // Vérifier si le statut est fourni dans le corps de la requête
  if (!status) {
    return res.status(400).json({ message: 'Le statut de la commande est requis' });
  }

  // Mettre à jour le statut de la commande avec l'ID orderId dans la base de données
  Order.findByIdAndUpdate(orderId, { status }, { new: true })
    .then((updatedOrder) => {
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Commande introuvable' });
      }

      res.json({ message: `Statut de la commande ${orderId} mis à jour` });
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour du statut de la commande', error);
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du statut de la commande' });
    });
}

async function getAllOrders(req, res)
{

  try {

    const token = req.headers.authorization.replace("Bearer ","");

    const payload = jwt.decode(token)
    const driverId = payload._id;

    const orders = await Order.find({
      status: 'En attente',
      blacklist: { $nin: [driverId] }
  });
    res.json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes en attente', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des commandes en attente' });
  }

}
async function getUserOrders(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", '');
    console.log(token)
    const payload = jwt.decode(token)
    const userId = payload._id;
    console.log(userId)
    const user = await client.db('CESI_EAT').collection('Users').findOne(
      { ID: userId },
      { projection: { firstName: 1 } }
    );
    console.log(user.firstName);
    const orders = await client.db('test').collection('orders').find(
      { customerName: user.firstName },
    ).toArray();
    console.log()

    res.json(orders);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes en attente', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des commandes en attente' });
  }

}
// Gestionnaire pour la modification d'une commande
function updateOrderHandler(req, res) {
  const orderId = req.params.orderId;
  const updatedData = req.body;

  // Utilise le modèle Order pour mettre à jour la commande avec l'ID orderId dans la base de données
  Order.findByIdAndUpdate(orderId, updatedData, { new: true })
    .then((updatedOrder) => {
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Commande introuvable' });
      }

      res.json(updatedOrder);
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour de la commande', error);
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la commande' });
    });
}

//Gestionnaire pour la suppresion d'une commande
function deleteOrderHandler(req, res) {
  const orderId = req.params.orderId;

  // Utilise le modèle Order pour supprimer la commande avec l'ID orderId de la base de données
  Order.findByIdAndDelete(orderId)
    .then((deletedOrder) => {
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Commande introuvable' });
      }

      res.json({ message: `Commande avec l'ID ${orderId} supprimée` });
    })
    .catch((error) => {
      console.error('Erreur lors de la suppression de la commande', error);
      res.status(500).json({ message: 'Erreur serveur lors de la suppression de la commande' });
    });
}

// Gestionnaire pour récupérer les détails d'une commande
function getOrderDetailsHandler(req, res) {
  const orderId = req.params.orderId;

  // Utilise le modèle Order pour récupérer les détails de la commande avec l'ID orderId
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: 'Commande introuvable' });
      }

      // Ici, tu peux effectuer toute autre logique nécessaire pour formater ou manipuler les détails de la commande avant de les renvoyer
      const orderDetails = {
        orderId: order._id,
        customerName: order.customerName,
        totalPrice: order.totalPrice,
        items: order.items,
        status: order.status
        // Autres détails spécifiques de la commande
      };

      res.json(orderDetails);
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des détails de la commande', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des détails de la commande' });
    });
}



const port = 3005;
app.listen(port, () => {
  console.log(`Le serveur Express écoute sur le port ${port}`);
});
