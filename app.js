express = require('express');//import de express
const app = express();//déclaration qui spécifie que cette application est bien un serveur express
const port = 3000;
app.use(express.urlencoded({ extended: true }));//paramètre qui permet de gérer les paramètres des requêtes POST & PUT
const data = require('./data');//récupère les données JSON du fichier data.js
const { Toy, Category } = require('./models')

const { Sequelize, where } = require('sequelize');
const res = require('express/lib/response');
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
    async function create_new_toy() {
        let cat;
        if (req.body.category) {
            cat = await Category.findOne({
                where: {
                    name: req.body.category
                }
            });
        }
        else {
            cat = { id: 1 }
        }
        const new_toy = await Toy.findOrCreate({
            where: {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category_id: cat.id
            }
        });
        return new_toy;
    }
    const added_toy = await create_new_toy();
    res.send(added_toy)

})
//modifier un jouet
app.put('/toys/:id', async (req, res) => {
    async function modifyToy() {
        const last_toy = await Toy.update(
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price
            },
            {
                where: {
                    id: req.params.id
                }
            });
        return last_toy
    }
    const newToy = await modifyToy();
    res.send(newToy);
})

//supprimer un jouet
app.delete('/toys/:id', async (req, res) => {
    let deleted_toy;
    let toy_byId = await Toy.findAll({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (toy_byId.length !== 0) {
        try {
            deleted_toy = await Toy.destroy({
                where: {
                    id: parseInt(req.params.id)
                }
            });
        }
        catch (error) {
            res.status(422)
            console.error(error);
        }
    }
    else {
        res.status(404).send('toy not foundur 404');
    }

})

//récupérer tous les jouets d'une catégorie
app.get('/categories/:name/toys', async (req, res) => {
    const myCategory = req.params.name
    //je verifie si le nom de la category est donné dans la requette
    let trueCategory = []
    if (req.params.name) {
        trueCategory = await Category.findOne({
            where: {
                name: myCategory
            }
        });
        if (trueCategory) {
            let toysFromCategory = await Toy.findAll(
                {
                    where: {
                        category_id: trueCategory.id
                    }
                }
            )
            res.send(toysFromCategory)
        }
        else res.sendStatus(404)
    } else res.sendStatus(404)
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
