// getting-started.js


const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb://127.0.0.1:27017/test');     //test your requests locally
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  
  // Var pour les encoder les comptes à caractères spéciaux 
  const username = encodeURIComponent('Nike');
  const password = encodeURIComponent('12345');
  await mongoose.connect(`mongodb+srv://${username}:${password}@db0cluster0.scxfepc.mongodb.net/test_Nike?retryWrites=true&w=majority`);
  
  //return res.status(200).json({sensor: sensors[sensorIndex], message: 'Connection success'});
  
}

// Schema creation
const kittySchema = new mongoose.Schema({
  name: String
});

// Adding a functionality
// NOTE: methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function speak() {
  const greeting = this.name
    ? 'Meow name is ' + this.name
    : 'I don\'t have a name';
  console.log(greeting);
};

// Compiling schema into model
const Kitten = mongoose.model('Apples', kittySchema);

// Creating document from class that exist within models
const silence = new Kitten({ name: 'Gala' });
console.log(silence.name); // 'Silence'

// New kitten called fluffy
const fluffy = new Kitten({ name: 'Golden' });
//fluffy.speak(); // "Meow name is fluffy"

// After the main function has completed, perform some asynchronous operations
main().then(async () => {
  // Save the fluffy document to the database
  await fluffy.save();
  // Call the speak method on the fluffy document again
  fluffy.speak();

  // Find all documents in the Kitten collection and log them
  const kittens = await Kitten.find();
  console.log(kittens);

  // Find all documents in the Kitten collection where the name starts with 'fluff'
  await Kitten.find({ name: /^fluff/ });
}).catch(err => console.log(err));      // Catch and log any errors