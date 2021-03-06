express = require('express');//import de express
const app = express();//déclaration qui spécifie que cette application est bien un serveur express
const port = 3000;
app.use(express.urlencoded({ extended: true }));//paramètre qui permet de gérer les paramètres des requêtes POST & PUT
const data = require('./data');//récupère les données JSON du fichier data.js
const { Toy, Category, Wish, Schedule, Elf } = require('./models')
const md5 = require("md5")

const { Sequelize, where } = require('sequelize');
const res = require('express/lib/response');
const { send } = require('express/lib/response');
// Option 3: Passing parameters separately (other dialects)
const db = new Sequelize('santas_db', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

//const Faker = require('faker');
//
//methode generate a elf randomly to create a schedule
function random_item(items) {

    return items[Math.floor(Math.random() * items.length)];

}
//get all elf 
const myelves = async function getElves() {
    const allElves = await Elf.findAll();
    return allElves;

}

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
    try {
        const created_category = await Category.findOrCreate({
            where: { name: req.body.name }
        })
        res.status(200)
        res.send(`success to creat the  category  `)
        res.send(created_category);
    }
    catch (error) {
        console.log(error);
        res.status(422)
    }
});

//modifier une catégorie
app.put('/categories/:id', async (req, res) => {
    try {
        const CategoryToModify = await Category.findOne(
            { where: { id: req.params.id } });
        const modified_category = await Category.update(
            {
                name: req.body.name

            },
            {
                where: {
                    id: req.params.id
                }
            });
        res.status(200);
        res.send(`the toy with name ${CategoryToModify.name} well modified `)
        res.json(CategoryToModify);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
})

//supprimer une catégorie
app.delete('/categories/:id', async (req, res) => {

    let categoryToDelete = await Category.findOne({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (categoryToDelete !== null) {
        try {

            await Toy.destroy({
                where: {
                    category_id: req.params.id
                }
            }
            )
            await Category.destroy(
                {
                    truncate: { cascade: true }
                },
                {
                    where: {
                        id: parseInt(req.params.id)
                    }
                });
            send.status(200),
                res.send(`the category with name ${categoryToDelete.name} well deleted `)
        }
        catch (error) {
            res.sendStatus(422)
            res.json(categoryToDelete)
            console.error(error);
        }
    }
    else {
        res.status(404).send('category doesn\'t exsist ');
    }

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
        let cat;
        if (req.body.category !== undefined) {
            cat = await Category.findOne({
                where: {
                    name: req.body.category
                }
            });
        }
        else {
            cat = { id: null }
        }
        const new_toy = await Toy.findOrCreate({
            where: {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category_id: cat.id
            }
        });
        res.json(new_toy)
        res.send(200)
    } catch (error) {
        console.log(error);
        res.send(422)
        res.send('name category non fourni')
    }
})
//modifier un jouetI
app.put('/toys/:id', async (req, res) => {
    try {
        const ToyToUpdate = await Toy.findOne({
            where: { id: req.params.id }
        })
        await Toy.update(
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

        res.status(200);
        res.send(`the toy with name ${ToyToUpdate.name} well modified `)
    } catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
})

//supprimer un jouet
app.delete('/toys/:id', async (req, res) => {

    let toyToDelete = await Toy.findOne({
        where: {
            id: parseInt(req.params.id)
        }
    });
    if (toyToDelete !== null) {
        try {
            await Toy.destroy({
                where: {
                    id: parseInt(req.params.id)
                }
            });
            res.status(200)
            res.send(`the category with name ${toyToDelete.name} well deleted `)

        }
        catch (error) {
            res.sendStatus(422)
            console.error(error);
        }
    }
    else {
        res.status(404).send('toy doesn\'t exsist ');
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
//======================================================  Elves  ======================================================// 

//lister toutes les elves
app.get('/elves', async (req, res) => {
    const all_Elves = await Elf.findAll();
    res.send(all_Elves);
});

//récupérer un elf
app.get('/elves/:id', async (req, res) => {
    try {
        let id_elf = req.params.id
        const elfById = await Elf.findOne({
            where: {
                id: id_elf
            }
        });
        res.status(200)
        res.send(elfById);
    } catch (error) {
        console.error(error);
        res.status(404)
    }
});

//ajouter un elf
app.post('/elves', async (req, res) => {
    try {
        const newElf = await Elf.findOrCreate({
            where: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                login: req.body.login,
                password: md5(req.body.password)
            }
        })
        res.status(200)
        res.send(`success to creat the  elf  `)
        res.send(newElf);
    }
    catch (error) {
        console.log(error);
        res.status(422)
    }
});

//modifier un elf
app.put('/elves/:id', async (req, res) => {
    try {
        const elfToModify = await Elf.findOne(
            {
                where: { id: req.params.id }
            });

        if (elfToModify) {
            // console.log(elfToModify.id);
            let elv = await Elf.update(
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    login: req.body.login,
                    password: md5(req.body.password)
                },
                {
                    where: {
                        id: req.params.id
                    }
                })

            res.status(200);
            res.send(`the toy with name ${elfToModify.first_name} well modified `)
            res.json(elfToModify);
        }
        else {
            res.send('the Elf doesn\'t exist')
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
})
//supprimer un Elf
app.delete('/elves/:id', async (req, res) => {
    res.send(null)
});
//======================================================  Wishe  ======================================================// 

//lister toutes les Wishes
app.get('/wishes', async (req, res) => {
    const allWishes = await Wish.findAll();
    res.send(allWishes);
});
//récupérer un whish
app.get('/wishes/:id', async (req, res) => {
    try {
        let id_wishe = req.params.id
        const wisheById = await Wish.findOne({
            where: {
                id: id_wishe
            }
        });
        if (wisheById != null) {
            res.status(200)
            res.send(wisheById);
        }
        else res.status(404).json(`the wishe with id ${req.params.id} doesn' exist`)
    }
    catch (error) {
        console.error(error);
    }
});

//ajouter wish
app.post('/wishes', async (req, res) => {
    try {
        const toyByName = await Toy.findOne({
            where: {
                name: req.body.toy,
            }
        })
        if (toyByName) {
            const newWish = await Wish.findOrCreate({
                where: {
                    nameChild: req.body.nameChild,
                    toy_id: toyByName.id,
                }
            })
            if (newWish != undefined) {
                const aElf = random_item(await Elf.findAll())
                const new_shedule = await Schedule.findOrCreate({
                    where: {
                        elf_id: aElf.id,
                        wishe_id: parseInt(newWish[0].id),
                        done_at: Date.now()
                    }
                })
                res.status(200)
                res.send(`un wish dont l'id ${newWish[0].id} serai créer pr le toy ${toyByName.name} pour ${req.body.nameChild} `)

                // res.send(`success to creat the  wish for${ req.body.nameChild } fo a ${ req.body.toy }
                // and new shedule for ${aElf.first_name} successfly created`)
            }
            else (console.log("echec to create the schedul"))
        }
        else {
            res.status(404).json(`the toy ${req.body.toy} dosn't exist`)
        }
    }
    catch (error) {
        console.log(error);
        res.status(422)
    }
});

//modifier un wishe
app.put('/wishes/:id', async (req, res) => {
    try {
        const wishToModify = await Wish.findOne(
            {
                where: { id: req.params.id }
            });
        if (wishToModify) {
            const toyByName = await Toy.findOne({
                where: {
                    name: req.body.toy,
                }
            })
            let newWishe = await Wish.update(
                {
                    nameChild: req.body.nameChild,
                    toy_id: toyByName.id
                },
                {
                    where: {
                        id: req.params.id
                    }
                });

            res.status(200).json(`the wish  for  ${wishToModify.nameChild} well modified `)
            res.json(newWishe[2]);
        }
        else res.status(404).json(`the wishe with id ${req.params.id} doesn't exist`)
    }
    catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
});
//supprimer un wish
app.delete('/wishes/:id', async (req, res) => {
    res.send(null)
});

//======================================================  Schedule  ======================================================// 

//lister toutes les Schedule /schedules?login=Rudolf&password=password_as_plain_text
app.get('/schedules/:login/:password', async (req, res) => {
    try {
        const myElf = await Elf.findAll({
            where: {
                login: req.params.login,
                password: md5(req.params.password)
            }
        })
        console.log(myElf);
        if (myElf.length != 0) {
            const schedulesByElf = await Schedule.findAll(
                {
                    where: {
                        elf_id: myElf[0].id
                    }
                }
            );
            res.status(200)
            res.json(schedulesByElf);
        }
        else res.send(`Now elf with this profile ${req.params.login} or wrong password`)
    }
    catch (error) {
        console.log(error);
        res.send(null)
    }
})
//récupérer un Schedule
app.get('/schedules/:', async (req, res) => {
    try {
        let id_ = req.params.id
        const scheduleById = await Schedule.findOne({
            where: {
                id: id_wishe
            }
        });
        if (wisheById != null) {
            res.status(200)
            res.send(wisheById);
        }
        else res.status(404).json(`the wishe with id ${req.params.id} doesn' exist`)
    }
    catch (error) {
        console.error(error);
    }
});

//ajouter Schedule
app.post('/schedules', async (req, res) => {
    try {
        const toyByName = await Toy.findOne({
            where: {
                name: req.body.toy,
            }
        })
        if (toyByName) {
            const newWishe = await Wish.findOrCreate({
                where: {
                    nameChild: req.body.nameChild,
                    toy_id: toyByName.id,
                }
            })
            res.status(200)
            res.send(`success to creat the  wish`)
            res.send(newWishe);
        }
        else {
            res.status(404).json(`the toy ${req.body.toy} dosn't exist`)
        }
    }
    catch (error) {
        console.log(error);
        res.status(422)
    }
});

//modifier un Schedule
app.put('/schedules/:id', async (req, res) => {
    try {
        const wishToModify = await Wish.findOne(
            {
                where: { id: req.params.id }
            });
        if (wishToModify) {
            const toyByName = await Toy.findOne({
                where: {
                    name: req.body.toy,
                }
            })
            let newWishe = await Wish.update(
                {
                    nameChild: req.body.nameChild,
                    toy_id: toyByName.id
                },
                {
                    where: {
                        id: req.params.id
                    }
                });

            res.status(200).json(`the Schedule  for  ${ScheduleToModify.nameChild} well modified `)
            res.json(newSchedule[2]);
        }
        else res.status(404).json(`there's no Schedule for ${req.body.elf} doesn't exist`)
    }
    catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
});
//supprimer un Schedule
app.delete('/scheduls/:id', async (req, res) => {
    res.send(null)
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
