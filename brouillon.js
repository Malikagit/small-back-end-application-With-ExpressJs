async function connect_db() {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
connect_db();

attributes: {
    include: [
        Sequelize.fn('COUNT', Sequelize.col('id'), nbrtoys)]
},
("there is no toys from this category")
    ("category doesn' existe")