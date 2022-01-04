const { Sequelize } = require('sequelize');
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('santas_db', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres'
});

async function ma_fonction() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
ma_fonction();