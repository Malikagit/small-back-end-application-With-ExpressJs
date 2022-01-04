express = require('express');//import de express
const app = express();//déclaration qui spécifie que cette application est bien un serveur express
const port = 3000;
app.use(express.urlencoded({ extended: true }));//paramètre qui permet de gérer les paramètres des requêtes POST & PUT
const data = require('./data');//récupère les données JSON du fichier data.js
const { Toy, Category } = require('./models')

const { Sequelize, where } = require('sequelize');
// Option 3: Passing parameters separately (other dialects)
const db = new Sequelize('santas_db', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

//page d'accueil
app.get('/', (req, res) => {

    res.send('page d\'accueil');
});

//======================================================  CATEGORIES  ======================================================// 

//lister toutes les catégories
app.get('/categories', async (req, res) => {
    const all_categories = await Category.findAll();
    res.send(all_categories);
});

//récupérer une catégorie
app.get('/categories/:id', async (req, res) => {
    let id_cat = req.params.id
    const category_byId = await Category.findOne({
        where: {
            id: id_cat
        }
    });
    res.send(category_byId);

});

//ajouter une catégorie
app.post('/categories', async (req, res) => {
    const created_category = await Category.create({
        name: `${req.body.name}`
    })
    res.send(created_category);

});

//modifier une catégorie
app.put('/categories/:id', async (req, res) => {
    const modified_category = await Category.update(
        { name: req.body.name },
        {
            where: {
                id: req.params.id
            }
        })
        ;
    res.json(modified_category);
});

//supprimer une catégorie
app.delete('/category/:id', async (req, res) => {
    res.send(null);
});



//======================================================  JOUETS  ======================================================// 

//lister tous les jouets
app.get('/toys', async (req, res) => {
    const all_toys = await Toy.findAll();
    res.send(all_toys);
});

//récupérer un jouet
app.get('/toys/:id', async (req, res) => {

    let toy_byId = await Toy.findAll({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (toy_byId !== null)
        res.send(toy_byId);
    else
        res.status(404).send('Erreur 404');
});

//ajouter un jouet
app.post('/toys', async (req, res) => {
    try {
        let cat_id = await Category.findOne({
            attributes: ['id']
        }, {
            where: { name: req.body.category }
        }

        );
        console.log(cat_id);
        let new_toy = await Toy.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category_id: cat_id
        });
        res.json(new_toy);
    } catch (e) {
        console.log(e)
    }

});

//modifier un jouet
app.put('/toy/:id', (req, res) => {
    res.send(null);
});

//supprimer un jouet
app.delete('/toy/:id', (req, res) => {
    res.send(null);
});

//récupérer tous les jouets d'une catégorie
app.get('/category/:name/toys', (req, res) => {
    res.send(null);
});

//route pour les autres chemins
app.route('/*').delete((req, res) => {
    res.status(404).send("<h1>Error 404</h1><br/>You shouldn't be here");
})
    .post((req, res) => {
        res.status(404).send("<h1>Error 404</h1><br/>You shouldn't be here");
    })
    .patch((req, res) => {
        res.status(404).send("<h1>Error 404</h1><br/>You shouldn't be here");
    })
    .put((req, res) => {
        res.status(404).send("<h1>Error 404</h1><br/>You shouldn't be here");
    });

app.route('/*/').delete((req, res) => {
    res.status(404).send("<h1>Error 404</h1><br/>You shouldn't be here");
})
    .post((req, res) => {
        res.status(404).send("<h1>Error 404</h1><br/>You shouldn't be here");
    })
    .patch((req, res) => {
        res.status(404).send("<h1>Error 404</h1><br/>You shouldn't be here");
    })
    .put((req, res) => {
        res.status(404).send("<h1>Error 404</h1><br/>You shouldn't be here");
    });


//lancement du serveur
app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
});
