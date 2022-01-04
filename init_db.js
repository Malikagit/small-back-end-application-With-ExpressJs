const { Toy, Category } = require('./models');

const create_tables = async () => {
    await Category.sync({ force: true });// créer une instruction pour créer la table
    await Toy.sync({ force: true });// créer une instruction pour créer la table

}
create_tables()