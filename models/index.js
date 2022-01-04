const { Sequelize } = require('sequelize');


const db = new Sequelize('santas_db', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

const Category = db.define('Category',
    {
        name: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        }
    })


const Toy = db.define('Toy',
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: { type: Sequelize.TEXT },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        category_id: {
            type: Sequelize.INTEGER,
            defaultValue: null,
            references: {
                model: 'Categories',
                key: 'id'
            }
        }
    });
module.exports = { db, Toy, Category }