const mysql = require("mysql2");
let db = {
  database: "",
  user: "",
  password: "",
};
if (process.env.NODE_ENV == "production") {
  db.database = process.env.DATABASE_PROD;
  db.user = process.env.DB_USER_PROD;
  db.password = process.env.DB_PASSWORD_PROD;
} else if (process.env.NODE_ENV == "development") {
  db.database = process.env.DATABASE_DEV;
  db.user = process.env.DB_USER_DEV;
  db.password = process.env.DB_PASSWORD_DEV;
} else if (process.env.NODE_ENV == "testing") {
  db.database = process.env.DATABASE_TESTING;
  db.user = process.env.DB_USER_TEST;
  db.password = process.env.DB_PASSWORD_TEST;
}
exports.pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: db.user,
  password: db.password,
  database: db.database,
  port: process.env.DATABASE_PORT || 3306,
  connectionLimit: 100,
});
