import { Request, Response } from "express";
import pool from "../db";
import { Grocery } from "../models/grocery.model";
import { ResultSetHeader } from "mysql2";
import { User } from "../models/user.model";

export const queryGrocery = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(1, parseInt(page as string, 10));
    const limitNumber = Math.max(1, parseInt(limit as string, 10));

    const offset = (pageNumber - 1) * limitNumber;

    const query = "SELECT * FROM groceries LIMIT ? OFFSET ?";
    const [rows] = await pool.execute(query, [`${limitNumber}`, `${offset}`]);

    const countQuery = "SELECT COUNT(*) as total FROM groceries";
    const [countResult]: any = await pool.execute(countQuery);
    const total = countResult[0]?.total || 0;

    res.status(200).json({
      data: rows,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createOrderForUser = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const { user_id, items } = req.body;
    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Invalid user_id or items array" });
      return;
    }

    await connection.beginTransaction();

    const [userRows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [user_id]
    );
    if ((userRows as User[]).length === 0) {
      throw new Error("User not found");
    }

    let totalPrice = 0;
    for (const item of items) {
      const [rows] = await connection.execute(
        "SELECT price, quantity FROM groceries WHERE id = ?",
        [item.grocery_id]
      );
      const grocery = (rows as Grocery[])[0];
      if (!grocery) {
        throw new Error(`Grocery with ID ${item.grocery_id} not found`);
      }
      if (grocery.quantity < item.quantity) {
        throw new Error(
          `Not enough stock for grocery ID ${item.grocery_id}. Available: ${grocery.quantity}`
        );
      }

      totalPrice += grocery.price * item.quantity;

      await connection.execute(
        "UPDATE groceries SET quantity = quantity - ? WHERE id = ?",
        [item.quantity, item.grocery_id]
      );
    }

    const [orderResult] = await connection.execute<ResultSetHeader>(
      "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
      [user_id, totalPrice]
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      const [rows] = await connection.execute(
        "SELECT price FROM groceries WHERE id = ?",
        [item.grocery_id]
      );
      const grocery = (rows as Grocery[])[0];

      await connection.execute(
        "INSERT INTO order_items (order_id, grocery_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.grocery_id, item.quantity, grocery.price]
      );
    }

    await connection.commit();

    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error: any) {
    await connection.rollback();
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};
