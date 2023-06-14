const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  // Var pour encoder les comptes à caractères spéciaux 
  const username = encodeURIComponent('Nike');
  const password = encodeURIComponent('12345');

  // Connexion à la BDD MongoDB
  await mongoose.connect(`mongodb+srv://${username}:${password}@db0cluster0.scxfepc.mongodb.net/test_Nike?retryWrites=true&w=majority`);
}

// Schema creation
const livraisonSchema = new mongoose.Schema({
  refus: Boolean,
  adresse_de_livraison: String,
  // users: { 
  //   info_users: String       faire correspondre avec tables users
  // },
  aquiter_client: Boolean,
  aquiter_resto: Boolean
});

// Compiling schema into model
const Livraison = mongoose.model('Livraison', livraisonSchema);

// Creating document from class that exist within models
const livraison1 = new Livraison({  
  refus: false, 
  adresse_de_livraison: '123, Fake Street', 
  // users: { 
  //   info_users: 'User Information 1'
  // }, 
  aquiter_client: true, 
  aquiter_resto: false
});

// After the main function has completed, perform some asynchronous operations
main().then(async () => {
  // Save the livraison1 document to the database
  await livraison1.save();

  // Find all documents in the Livraison collection and log them
  const livraisons = await Livraison.find();
  console.log(livraisons);
}).catch(err => console.log(err)); // Catch and log any errors
