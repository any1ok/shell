const path = require("path");
const Sequelize = require("sequelize");
const mybatisMapper = require("mybatis-mapper");
// const envType = process.env.ENV ? process.env.ENV : "dev";

// db real
const sequelize = new Sequelize("sp", "sp", "standardpass13258", {
  host: "sp.cluster-cfun0a43ytwh.ap-northeast-1.rds.amazonaws.com",
  port: 5432,
  dialect: "postgres",
  dialectOptions: {
    statement_timeout: 5000,
    idle_in_transaction_session_timeout: 5000
  },
  define: {},
  // dialectOptions: {
  //   options: {
  //     requestTimeout: 10000
  //   }
  // },
  pool: {
    max: 60,
    min: 0,
    idle: 10000,
    acquire: 20000
  },
  logging: console.log,
});

const sqlPath = path.join(__dirname, "..", ".", `/sql`);

mybatisMapper.createMapper([
  `${sqlPath}/base.xml`
]);

var db = async function(req, res, next) {
  // req.envType = envType;
  req.sequelize = sequelize;
  // req.sequelize_security = sequelize_security;
  req.mybatisMapper = mybatisMapper;
  next();
};

module.exports = { db, sequelize, mybatisMapper };
