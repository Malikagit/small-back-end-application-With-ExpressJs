const { db, Toy, Category, Elf, Wish, Schedule } = require('./models');

const create_tables = async () => {
    await Category.sync({ force: true });// créer une instruction pour créer la table
    await Toy.sync({ force: true });// créer une instruction pour créer la table
    await Elf.sync({ force: true });// créer une instruction pour créer la table
    await Wish.sync({ force: true });// créer une instruction pour créer la table
    await Schedule.sync({ force: true });// créer une instruction pour créer la table

}
create_tables()