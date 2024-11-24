import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { UserTable } from './models/user.model';
import { GroceryTable } from './models/grocery.model';
import { OrderTable } from './models/order.model';
import { OrderItemTable } from './models/order_items.model';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const initializeDatabase = async () => {
  try {
    await pool.query(UserTable);
    await pool.query(GroceryTable);
    await pool.query(OrderTable);
    await pool.query(OrderItemTable);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase().catch((err) => {
  console.error('Unexpected error during database initialization:', err);
});
export default pool;
