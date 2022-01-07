const { Toy, Category, db, Elf, Wish, Schedule } = require('./models');
const { toys: my_toys, categories: my_categories, elves: my_elves, wishes: my_wishes } = require('./data.js');

async function dump_stuff() {
    for (let i = 0; i < my_categories.length; i++) {
        let a_cat = await Category.build(my_categories[i]);
        await a_cat.save();
        console.log('Category', a_cat.name, 'was saved successfully.');
    }
    for (let i = 0; i < my_toys.length; i++) {
        let toy = my_toys[i];
        if (toy.category_id !== null)
            toy.category_id++;//augmente tout les ID de 1 car ils commencent à 0 dans le fichier data.js
        let a_toy = await Toy.build(toy);
        await a_toy.save();
        console.log('Toy', a_toy.name, 'was saved successfully.');
    }
    for (let i = 0; i < my_elves.length; i++) {
        let elf = my_elves[i];
        let a_elf = await Elf.build(elf);
        await a_elf.save();
        console.log('Elve', a_elf.first_name, ' ', alf.last_name 'was saved successfully.');
    }
    for (let i = 0; i < my_wishes.length; i++) {
        let wish = my_wishes[i];
        let a_wish = await Wish.build(wish);
        await a_wish.save();
        console.log('Wishe', a_wish.id, 'was saved successfully.');
    }

    process.exit(1);
}

dump_stuff();