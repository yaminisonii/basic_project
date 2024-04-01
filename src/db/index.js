const {Sequelize} = require("sequelize")

const sequelize = new Sequelize('root', 'postgres', 'yamini123', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
})

// const connectdb = async (req, res) => {
//     try {
//         await sequelize.authenticate()
//         // console.log("db connected");
//     } catch (error) {
//         console.log("db error", error);
//     }
// }

module.exports = sequelize