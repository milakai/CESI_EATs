// getting-started.js


const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb://127.0.0.1:27017/test');     //test your requests locally
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  
  // Var pour les encoder les comptes à caractères spéciaux 
  const username = encodeURIComponent('Nike');
  const password = encodeURIComponent('12345');

  // Connexion à la BDD MongoDB
  await mongoose.connect(`mongodb+srv://${username}:${password}@db0cluster0.scxfepc.mongodb.net/test_Nike?retryWrites=true&w=majority`);
  
  //return res.status(200).json({sensor: sensors[sensorIndex], message: 'Connection success'});
  
}

// Schema creation
const articleSchema = new mongoose.Schema({
  article: String,
  nom: String,
  prix: Number
});

// Adding a functionality
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
// TODO: add functions for delete, retrieve? and modify
articleSchema.methods.speak = function speak() {
  const greeting = this.name
    ? 'Les articles ' + this.name
    : 'sont';
  console.log(greeting);
};

// Compiling schema into model
const Articles = mongoose.model('Articles', articleSchema);

// Creating document from class that exist within models
const article1 = new Articles({ article: 'Bruh?', nom: 'Coca-cola', prix: 23 });
console.log(article1.article, article1.prix); // 'Silence'

// New kitten called fluffy
const article2 = new Articles({ article: 'Bruh?', nom: 'Cheeseburger', prix: 10 });
article2.speak(); // "Meow name is fluffy"

// After the main function has completed, perform some asynchronous operations
main().then(async () => {
  // Save the fluffy document to the database
  await article1.save();
  await article2.save();

  // Call the speak method on the fluffy document again
  article1.speak();
  article2.speak();

  // Find all documents in the Kitten collection and log them
  const articles_plusieurs = await Articles.find();
  console.log(articles_plusieurs);

  // Find all documents in the Kitten collection where the name starts with 'fluff'
  // await Kitten.find({ name: /^fluff/ });
}).catch(err => console.log(err));      // Catch and log any errors