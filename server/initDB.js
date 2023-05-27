const config = require('config')
const { Sequelize } = require('sequelize');

// export async function initializeDB(){
//     console.log("AAA");
//     const sequelize = new Sequelize(config.get('DB_name'), config.get('DB_user'), config.get('DB_user_password'), {
//         dialect: "mssql",
//         host: config.get('DB_host'),
//         port: config.get('DB_port'),
//         dialectOptions: {
//           options: { instanceName: config.get('DB_instanceName') }
//       }
//       });
//       try{
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//         // await sequelize.sync({force: true}).then(result=>{
//         //     console.log(result);}).catch(err=> console.log(err));
//     }
//     catch(e){console.log(e);}
// }

const sequelize = new Sequelize(config.get('DB_name'), config.get('DB_user'), config.get('DB_user_password'), {
    dialect: "mssql",
    host: config.get('DB_host'),
    port: config.get('DB_port'),
    dialectOptions: {
      options: { instanceName: config.get('DB_instanceName') }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  module.exports = sequelize;