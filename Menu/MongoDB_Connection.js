// getting-started.js


const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb://127.0.0.1:27017/test');     //test your requests locally
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  
  // Var pour encoder les comptes à caractères spéciaux 
  const username = encodeURIComponent('Nike');
  const password = encodeURIComponent('12345');

  // Connexion à la BDD MongoDB
  await mongoose.connect(`mongodb+srv://${username}:${password}@db0cluster0.scxfepc.mongodb.net/test_Nike?retryWrites=true&w=majority`);
  
  //return res.status(200).json({sensor: sensors[sensorIndex], message: 'Connection success'});
  
}

// Schema creation
const menuSchema = new mongoose.Schema({
  prix_M: Number,
  articles: String
});

// Adding a functionality
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
menuSchema.methods.speak = function speak() {
  const greeting = this.name
    ? 'Les articles ' + this.name
    : 'sont';
  console.log(greeting);
};

// Compiling schema into model
const Menus = mongoose.model('Menus', menuSchema);

// Creating document from class that exist within models
const menu1 = new Menus({ prix_M: 23, articles: 'Orangina'});
console.log(menu1.articles, menu1.prix_M); // 'Silence'

// New kitten called fluffy
const menu2 = new Menus({ prix_M: 10, articles: 'Frites'});
menu2.speak(); // "Meow name is fluffy"

// After the main function has completed, perform some asynchronous operations
main().then(async () => {
  // Save the fluffy document to the database
  await menu1.save();
  await menu2.save();

  // Call the speak method on the fluffy document again
  menu1.speak();
  menu2.speak();

  // Find all documents in the Kitten collection and log them
  const Menus_plusieurs = await Menus.find();
  console.log(Menus_plusieurs);

  // Find all documents in the Kitten collection where the name starts with 'fluff'
  // await Kitten.find({ name: /^fluff/ });
}).catch(err => console.log(err));      // Catch and log any errors