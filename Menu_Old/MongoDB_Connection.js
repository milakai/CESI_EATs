// getting-started.js

// Importer mongoose
const mongoose = require('mongoose');
// Importer Express
const express= require('express');

// Créer une nouvelle application Express
const app=express();

// for parsing application/json
app.use(express.json()); 

const port=3000;

// mettre port 3000 en état LISTEN
app.listen(port, () => {
  console.log('Application started and listening on port ${port}');
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
  idMenu: Number,
  prix_M: Number,
  articles: String
});
  
// Article schema creation
const articleSchema = new mongoose.Schema({
  idArticle: Number,
  article: String,
  nom: String,
  prix: Number
});
    
// Compiling schema into model
const Menus = mongoose.model('Menus', menuSchema);
const Articles= mongoose.model('Articles', articleSchema);

// Ecrire sur la BDD
app.post('/AjouterArticle', async (req, res) => {
	console.log(req.body)

  // // Adding a functionality
  // // NOTE: methods must be added to the schema before compiling it with mongoose.model()
  // menuSchema.methods.speak = function speak() {
  //   const greeting = this.name
  //     ? 'Les articles ' + this.name
  //     : 'sont';
  //   console.log(greeting);
  // };

	// Vérifiez si un capteur avec le même ID existe déjà
	// const existingSensor=sensors.find(sensor=>sensor.id === newSensor.id);
	// if (existingSensor){
	// 	return res.status(400).json({message: 'Sensor with this ID already exists'});
	// }

	// New article called article1, then save
  const article1 = new Articles({ idArticle: 1, article: 'Boisson', nom: 'Fanta', prix: 1});
  await article1.save();

  // menu1.speak(); // "Use speak() to display name of menu2 in console"
  console.log(article1.article, article1.nom, article1.prix); // 'Les articles 10 sont Frites' in console

  // After the main function has completed, perform some asynchronous operations
  // main().then(async () => {
  //   // Save the fluffy document to the database
  //   await menu1.save();

  //   // Call the speak method on the fluffy document again
  //   menu1.speak();

  // }).catch(err => console.log(err));      // Catch and log any errors
  
// Envoyer ok POST  
  return res.sendStatus(201);
});

// Ecrire sur la BDD
app.post('/AjouterMenu', async (req, res) => {
  console.log(req.body)

  // Vérifier si un menu avec l'ID spécifié existe déjà
  const existingMenu = await Menus.findOne({ idMenu: req.body.idMenu });

  // Si un menu avec cet ID existe déjà, renvoyer une erreur
  if (existingMenu) {
    return res.status(400).send('A menu with this ID already exists.');
  }

  // Si aucun menu avec cet ID n'est trouvé, créer et enregistrer le nouveau menu
  const menu1 = new Menus({ idMenu: req.body.idMenu, prix_M: req.body.prix_M, articles: req.body.articles });
  await menu1.save();

  console.log(menu1.articles, menu1.prix_M); // 'Les articles 10 sont Frites' in console

  // Envoyer ok POST  
  return res.status(201).send(menu1);
});


// Route pour modifier un élément du menu
app.put('/menu/:id', async (req, res) => {
  try {
    const menuMod = await Menus.findByIdAndUpdate(
      req.params.id, // Utiliser l'ID envoyé en paramètre de l'URL
      req.body, // Utiliser les données envoyées dans le corps de la requête
      { new: true, runValidators: true } // Renvoyer le document mis à jour et exécuter les validateurs de schéma
    );

    // Si le menu avec l'ID spécifié n'est pas trouvé, renvoyer une erreur
    if (!menuMod) {
      return res.status(404).send('Menu item with the given ID was not found.');
    }

    // Renvoyer le menu mis à jour
    res.send({menuMod});
  } catch (error) {
    console.error(error)
    // En cas d'erreur (par exemple, une validation échouée), renvoyer une erreur 400
    res.status(400).send(error);
  }
});

// Check Database to see if write is OK
app.get('/AfficherAM', async (req, res) => {
	// Fetch all Menus
  const menus = await Menus.find();
  const articles =await Articles.find();
  res.json(menus);
  
  // Find all documents in the Kitten collection and log them
  // main().then(async () =>{
  //   const Menus_plusieurs = await menu1.find();
  // }).catch(err2 =>console.log(err2));
  // console.log(Menus_plusieurs);

});
