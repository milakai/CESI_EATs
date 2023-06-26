const mongoose = require('mongoose');
const express= require('express');
const cors = require('cors');

const app=express();
app.use(cors());
app.use(express.json()); 
const port=3003;

app.listen(port, () => {
  console.log('Application started and listening on port', port);
});

async function main() {
  const username = encodeURIComponent('Nike');
  const password = encodeURIComponent('12345');

  await mongoose.connect(`mongodb+srv://${username}:${password}@db0cluster0.scxfepc.mongodb.net/test_Nike?retryWrites=true&w=majority`); 
}
main().catch(err => console.log(err));

const menuSchema = new mongoose.Schema({
  prix_M: Number,
  articles: String,
  nomMenu: String
});
  
const articleSchema = new mongoose.Schema({
  article: String,
  nom: String,
  prix: Number,
  quantite: Number
});
    
const Menus = mongoose.model('Menus', menuSchema);
const Articles= mongoose.model('Articles', articleSchema);

app.post('/AjouterArticle', async (req, res) => {
	console.log(req.body)


  try{
    const article1 = await Articles.findOne( req.body._id );
  
    if (article1) {
      return res.status(400).send('A menu with this ID already exists.');
    }
  } catch(error){
    console.error(error);
    res.sendStatus(400).send('This article already exists. Please increase its quantity.');
  }

  const article1 = new Articles({ article: req.body.article, nom: req.body.nom, prix: req.body.prix, quantite: req.body.quantite});
  await article1.save();

  console.log(article1.article, article1.nom, article1.prix, article1.quantite); 
  
  return res.sendStatus(201);
});

app.post('/AjouterMenu', async (req, res) => {
  console.log(req.body)

  const existingMenu = await Menus.findOne( { nomMenu: req.body.nomMenu} );
  console.log('Nom du menu est:', existingMenu?.nomMenu)                     

  if (existingMenu) {
    return res.status(400).send('A menu with this ID already exists.');
  }

  const menu1 = new Menus({ prix_M: req.body.prix_M, articles: req.body.articles, nomMenu: req.body.nomMenu });
  await menu1.save();


  console.log(menu1.articles, menu1.prix_M, menu1.nomMenu);


  return res.status(201).send(menu1);
});



app.put('/menu', async (req, res) => {
  try {
    const update = {
      prix_M: req.body.prix_M,
      articles: req.body.articles
    };

    const menuMod = await Menus.findOneAndUpdate(
      {nomMenu: req.body.nomMenu},          
      update,                             
      { new: true, runValidators: true } 
    );


   
    if (!menuMod) {
      return res.status(404).send('Menu item with the given ID was not found.');
    }

    
    res.send({menuMod});
  } catch (error) {
    console.error(error)
   
    res.status(400).send(error);
  }
});


app.put('/article', async (req, res) => {
  try {
    const update = {
      prix: req.body.prix,
      article: req.body.article,
      nom: req.body.nom,
      quantite: req.body.quantite
    };

    const articleMod = await Articles.findOneAndUpdate(
      {nom: req.body.nom},         
      update,                            
      { new: true, runValidators: true } 
    );



    if (!articleMod) {
      return res.status(404).send('Article item with the given ID was not found.');
    }

   
    res.send({articleMod});
  } catch (error) {
    console.error(error)
   
    res.status(400).send(error);
  }
});


app.get('/AfficherAM', async (req, res) => {

  const menus = await Menus.find();
  const articles = await Articles.find();
  res.json(menus);
});


app.delete('/menu', async (req, res) => {
  try {
    const menuDel = await Menus.findOneAndRemove({nomMenu: req.body.nomMenu});
    
    if (!menuDel) {
      return res.status(404).send('Menu item with the given ID was not found.');
    }

    res.send({ message: 'Menu item successfully deleted' });
  } catch (error) {
    console.error(error)
    res.status(400).send(error);
  }
});

app.delete('/article', async (req, res) => {
  try {
    const articlesDel = await Articles.findOneAndDelete({nom: req.body.nom});
    
    if (!articlesDel) {
      return res.status(404).send('Articles item with the given name was not found.');
    }

    res.send({ message: "Articles item successfully deleted" });
  } catch (error) {
    console.error(error)
    res.status(400).send(error);
  }
});