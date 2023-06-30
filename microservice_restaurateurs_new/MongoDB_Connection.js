
const jwt = require('jsonwebtoken');

// Importer mongoose
const mongoose = require('mongoose');
// Importer Express
const express = require('express');
const { MongoClient } = require('mongodb');

const cors = require('cors');

// Créer une nouvelle application Express
const app = express();
app.use(cors({
  origin: '*' // allow only this origin
}));

// Headers cors
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//app.use(cors());

// for parsing application/json
app.use(express.json());

const uri = "mongodb+srv://Tom:rHiNUmndV0MIzX3t@db0cluster0.scxfepc.mongodb.net/?authMechanism=DEFAULT";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = 3003;

// mettre port 3000 en état LISTEN
app.listen(port, () => {
  console.log('Application started and listening on port', port);
});

async function main() {
  // await mongoose.connect('mongodb://127.0.0.1:27017/test');     //test your requests locally
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

  // Var pour encoder les comptes à caractères spéciaux 
  const username = encodeURIComponent('Nike');
  const password = encodeURIComponent('12345');

  // Connexion à la BDD MongoDB
  await mongoose.connect(`mongodb+srv://${username}:${password}@db0cluster0.scxfepc.mongodb.net/test_Nike?retryWrites=true&w=majority`);
}
main().catch(err => console.log(err));

// Menu schema creation 
const menuSchema = new mongoose.Schema({
  prix_M: Number,
  articles: [String],
  nomMenu: String,
  restaurant: String
});

// Article schema creation
const articleSchema = new mongoose.Schema({
  article: String,
  nom: String,
  prix: Number,
  quantite: Number,
  restaurant: String
});

// Compiling schema into model
const Menus = mongoose.model('Menus', menuSchema);
const Articles = mongoose.model('Articles', articleSchema);


app.get('/AfficherAM', async (req, res) => {

  const menus = await Menus.find();
  const articles = await Articles.find();
  res.json(menus);
});

// Route pour ajouter un article à la BDD
// Route pour ajouter un article à la BDD
app.post('/AjouterArticle', async (req, res) => {
  console.log(req.body);
  const token = req.headers.authorization.replace("Bearer ", '');
  const payload = jwt.decode(token)
  const restauId = payload._id;
  const userType = payload.type;

  try {
    if (userType === 'restaurant_owner') {
      // Vérifier si un article avec l'ID spécifié existe déjà

      // console.log('Id menu est:', existingMenu.idMenu)                      // debug
      const restau = await client.db('CESI_EAT').collection('Users').findOne(
        { ID: restauId },
        { projection: { restaurantName: 1 } }
      );
      console.log(restau)
      const article1 = await Articles.findOne({ _id: req.body._id });
      if (article1) {
        return res.status(400).send('An article with this ID already exists.');
      }

      // New article called article1, then save to DB
      article1 = new Articles({
        article: req.body.article,
        nom: req.body.nom,
        prix: req.body.prix,
        quantite: req.body.quantite,
        restaurant: restau.restaurantName
      });

      // Save article1 to the database
      await article1.save();

      // Display article1 in console
      console.log(
        article1.article,
        article1.nom,
        article1.prix,
        article1.quantite,
        article1.restaurant
      );

      // Envoyer une réponse indiquant que l'article a été ajouté avec succès
      return res.sendStatus(201);
    } else {
      res.status(403).send("Connectez vous en tant que restaurateur");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send('An error occurred while adding the article.');
  }
});



// Route pour ajouter un menu à la BDD
app.post('/AjouterMenu', async (req, res) => {
  console.log(req.body);
  const token = req.headers.authorization.replace("Bearer ", '');
  const payload = jwt.decode(token)
  const restauId = payload._id;
  const userType = payload.type;
  // Vérifier si un menu avec le nom spécifié existe déjà
  const existingMenu = await Menus.findOne({ nomMenu: req.body.nomMenu });
  console.log('Nom du menu est:', existingMenu?.nomMenu);                      // debug

  try {
    if (userType === 'restaurant_owner') {
      const restau = await client.db('CESI_EAT').collection('Users').findOne(
        { ID: restauId },
        { projection: { restaurantName: 1 } }
      );
      console.log("RESTAU : ", restau.restaurantName)
      console.log(restau.restaurantName)
      if (existingMenu) {
        return res.status(409).send('A menu with this name already exists.');
      }

      // Vérifier si l'article existe dans la table des articles
      for (let articleName of req.body.articles) {
        // Try to find each article in the database.
        const existingArticle = await Articles.findOne({ nom: articleName });

        // If an article doesn't exist, return an error.
        if (!existingArticle) {
          return res.status(404).send(`The article with name ${articleName} does not exist, please add it.`);
        }
      }

      // Vérifier si l'article existe déjà dans le menu
      const articleInMenu = existingMenu?.articles.find(article => article === req.body.articles);

      if (articleInMenu) {
        return res.status(409).send('The article is already added in the menu, please increase its quantity.');
      }

      // Si aucun menu avec cet ID n'est trouvé, créer et enregistrer le nouveau menu
      const menu1 = new Menus({ prix_M: req.body.prix_M, articles: req.body.articles, nomMenu: req.body.nomMenu, restaurant: restau.restaurantName });
      await menu1.save();
      // Affichage élèments du Menu dans la console
      console.log(menu1.articles, menu1.prix_M, menu1.nomMenu, menu1.restaurant);

      // Envoyer ok POST  
      return res.status(201).send(menu1);
      // console.log('Id menu est:', existingMenu.idMenu)                    
    } else {
      res.status(403).send("Connectez vous en tant que restaurateur");
    }
  } catch (error) {
    console.error(error);
  }
});




// Route pour modifier un élément du menu
app.put('/menu', async (req, res) => {
  try {
    const update = {
      prix_M: req.body.prix_M,
      articles: req.body.articles,
      restaurant: req.body.restaurant
    };

    const menuMod = await Menus.findOneAndUpdate(
      { nomMenu: req.body.nomMenu },          // Utiliser le nom du Menu envoyé dans le corps de la requête
      update,                             // Utiliser les données envoyées dans le corps de la requête
      { new: true, runValidators: true } // Renvoyer le document mis à jour et exécuter les validateurs de schéma
    );


    // Si le menu avec le nom spécifié n'est pas trouvé, renvoyer une erreur
    if (!menuMod) {
      return res.status(404).send('Menu item with the given name was not found.');
    }

    // Renvoyer le menu mis à jour
    res.send({ menuMod });
  } catch (error) {
    console.error(error)
    // En cas d'erreur (par exemple, une validation échouée), renvoyer une erreur 400
    res.status(400).send(error);
  }
});

// Route pour modifier un élément d'article
// TODO: tester - OK
app.put('/article', async (req, res) => {
  try {
    const update = {
      prix: req.body.prix,
      article: req.body.article,
      nom: req.body.nom,
      quantite: req.body.quantite,
      restaurant: req.body.restaurant
    };

    const articleMod = await Articles.findOneAndUpdate(
      { nom: req.body.nom },          // Utiliser le nom du Menu envoyé dans le corps de la requête
      update,                             // Utiliser les données envoyées dans le corps de la requête
      { new: true, runValidators: true } // Renvoyer le document mis à jour et exécuter les validateurs de schéma
    );


    // Si le menu avec le nom spécifié n'est pas trouvé, renvoyer une erreur
    if (!articleMod) {
      return res.status(404).send('Article item with the given name was not found.');
    }

    // Renvoyer l'article mis à jour
    res.send({ articleMod });
  } catch (error) {
    console.error(error)
    // En cas d'erreur (par exemple, une validation échouée), renvoyer une erreur 400
    res.status(400).send(error);
  }
});

// Check Database to see if write is OK
app.get('/AfficherMenu', async (req, res) => {
  // Fetch all Menus
  const token = req.headers.authorization.replace("Bearer ", '');
  const payload = jwt.decode(token)
  const restauId = payload._id;
  const userType = payload.type;

  try {
    if (userType === 'restaurant_owner') {
      // Vérifier si un article avec l'ID spécifié existe déjà

      // console.log('Id menu est:', existingMenu.idMenu)                      // debug
      const restau = await client.db('CESI_EAT').collection('Users').findOne(
        { ID: restauId },
        { projection: { restaurantName: 1 } }
      );
      console.log("RESTAU : ", restau.restaurantName)
      const menus = await Menus.find({ restaurant: restau.restaurantName });
      console.log("MENU : ", menus)

      return res.status(201).json(menus);
    } else {
      res.status(403).send("Connectez vous en tant que restaurateur");
    }
  } catch (error) {
    console.error(error);
  }
});

// Check Database to see if write is OK        
app.get('/AfficherArticles', async (req, res) => {
  // Fetch all Articles
  const articles = await Articles.find();
  res.json(articles);
});

// Route to delete a menu
app.delete('/menu', async (req, res) => {
  console.log(req.body);
  try {
    const menuDel = await Menus.findOneAndRemove({ nomMenu: req.body.nomMenu });

    // If the menu item with the specified Menu name is not found, return an error
    if (!menuDel) {
      return res.status(404).send('Menu with the given name was not found.');
    }

    // Return a success message
    res.send({ message: 'Menu successfully deleted' });
  } catch (error) {
    console.error(error)
    // In case of an error, send a 400 error
    res.status(400).send(error);
  }
});

// Route to delete an articles item; TODO: Check under which circumstances this route might be used
app.delete('/article', async (req, res) => {
  try {
    const articlesDel = await Articles.findOneAndDelete({ nom: req.body.nom });

    // If the menu item with the specified name is not found, return an error
    if (!articlesDel) {
      return res.status(404).send('Articles item with the given name was not found.');
    }

    // Return a success message
    res.send({ message: "Articles item successfully deleted" });
  } catch (error) {
    console.error(error)
    // In case of an error, send a 400 error
    res.status(400).send(error);
  }
});