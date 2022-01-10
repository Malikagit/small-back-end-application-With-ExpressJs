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
        },

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
    })
const Elf = db.define('Elf',
    {
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        login: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }

    });
const Wish = db.define('Wish',
    {
        nameChild: {
            type: Sequelize.STRING,
            allowNull: false
        },
        toy_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Toys',
                key: 'id'
            }
        }

    }
);
const Schedule = db.define('Schedule',
    {
        elf_id:
        {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Elves',
                key: 'id'
            }
        },
        wishe_id:
        {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Wishes',
                key: 'id'
            }
        },
        done: {
            type: Sequelize.BOOLEAN,
        },
        done_at: {
            type: Sequelize.DATE
            , default: null

        }

    })

module.exports = { db, Toy, Category, Elf, Wish, Schedule }