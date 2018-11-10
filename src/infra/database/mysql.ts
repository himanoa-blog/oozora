import * as mysql from "promise-mysql";
import * as dotenv from "dotenv";

dotenv.config();

const connectionConfig: mysql.PoolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "", 10),
  database: process.env.DB_NAME,
  connectionLimit: 10
};

const pool = mysql.createPool(connectionConfig);
export default pool;
