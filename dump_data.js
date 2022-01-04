const {Toy, Category, db} = require('./models');

const { toys : my_toys, categories : my_categories } = require('./data.js');

async function dump_stuff(){
    for (let i = 0; i<my_categories.length; i++)
    {
        let a_cat = Category.build(my_categories[i]);
        await a_cat.save();
        console.log('Category', a_cat.name, 'was saved successfully.');
    }
    for (let i = 0; i<my_toys.length; i++)
    {
        let toy = my_toys[i];
        if (toy.category_id!==null)
            toy.category_id++;//augmente tout les ID de 1 car ils commencent à 0 dans le fichier data.js
        let a_toy = Toy.build(toy);
        await a_toy.save();
        console.log('Toy', a_toy.name, 'was saved successfully.');
    }
    process.exit(1);
}

dump_stuff();