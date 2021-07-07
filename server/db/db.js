const Sequelize = require("sequelize");

const db = new Sequelize(process.env.DATABASE_URL || "messenger", "postgres", "556216", {
  dialect: "postgres",
  logging: false
});

module.exports = db;
