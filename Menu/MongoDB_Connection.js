// getting-started.js

// Importer mongoose
const mongoose = require('mongoose');
// Importer Express
const express= require('express');

// Créer une nouvelle application Express
const app=express();

// for parsing application/json
app.use(express.json()); 

// mettre port 3000 en état LISTEN
app.listen(3000, () => {
  console.log('Application started and listening on port 3000');
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
  articles: String
});
  
// Article schema creation
const articleSchema = new mongoose.Schema({
  article: String,
  nom: String,
  prix: Number
});
    
// Compiling schema into model
const Menus = mongoose.model('Menus', menuSchema);
const Articles= mongoose.model('Articles', articleSchema);

// Ecrire sur la BDD
app.post('/GestionAM', async (req, res) => {
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
  const article1 = new Articles({ article:'Boisson', nom: 'Fanta', prix: 1});
  await article1.save();

  // New menu called menu1, then save
  const menu1 = new Menus({ prix_M: 10, articles: 'Frites'});
  await menu1.save();

  // menu1.speak(); // "Use speak() to display name of menu2 in console"
  console.log(menu1.articles, menu1.prix_M); // 'Les articles 10 sont Frites' in console

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

// Check Database to see if write is OK
app.get('/GestionAM', async (req, res) => {
	// Fetch all Menus
  const menus = await Menus.find();
  res.json(menus);
  
  
  // Find all documents in the Kitten collection and log them
  // main().then(async () =>{
  //   const Menus_plusieurs = await menu1.find();
  // }).catch(err2 =>console.log(err2));
  // console.log(Menus_plusieurs);

  // // Find all documents in the Kitten collection where the name starts with 'fluff'
  // // await Kitten.find({ name: /^fluff/ });
});
