const { v4: uuidv4 } = require('uuid');

// Générer un nouvel UUID
const userId = uuidv4();

// Utilisez cet UUID lors de l'insertion de l'utilisateur dans la base de données SQL et MongoDB


// Assurez-vous que votre application est conçue pour gérer correctement les erreurs et les échecs de transaction.
// Par exemple, si l'insertion dans la base de données SQL réussit mais que l'insertion dans MongoDB échoue, vous devrez décider comment gérer cette situation
// (par exemple, annuler l'insertion dans la base de données SQL, réessayer l'insertion dans MongoDB, etc.).

// Si votre application est distribuée et que plusieurs instances de votre service d'authentification peuvent être en cours d'exécution en même temps,
// vous devrez vous assurer que la génération et l'utilisation de l'UUID sont correctement synchronisées entre les différentes instances. 
// Cela peut généralement être géré par la nature unique des UUID, mais c'est quelque chose à garder à l'esprit.

// Enfin, gardez à l'esprit que la gestion de deux bases de données pour les mêmes utilisateurs peut augmenter la complexité de votre application et peut rendre
// plus difficile la garantie de la cohérence des données entre les deux bases de données.
//  Assurez-vous de bien comprendre les avantages et les inconvénients de cette approche et envisagez d'utiliser des techniques comme les transactions à 
//  deux phases si la cohérence forte entre les bases de données est nécessaire.