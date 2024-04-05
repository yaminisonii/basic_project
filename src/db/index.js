const {Sequelize} = require("sequelize")

const sequelize = new Sequelize('root', 'postgres', 'yamini123', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
})

module.exports = sequelize