import { Request, Response } from "express";
import pool from "../db";
import { ResultSetHeader } from "mysql2";

export const addGrocery = async (req: Request, res: Response) => {
  try {
    const { name, price, quantity } = req.body;

    // Explicitly type the result
    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO groceries (name, price, quantity) VALUES (?, ?, ?)",
      [name, price, quantity]
    );

    res.status(201).json({ message: "Grocery item added", id: result.insertId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateGroceryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { name, quantity, price } = req.body;
    const fieldsToUpdate: string[] = [];
    const valuesToUpdate: any[] = [];

    if (name) {
      fieldsToUpdate.push("name = ?");
      valuesToUpdate.push(name);
    }
    if (quantity !== undefined) {
      fieldsToUpdate.push("quantity = ?");
      valuesToUpdate.push(quantity);
    }
    if (price !== undefined) {
      fieldsToUpdate.push("price = ?");
      valuesToUpdate.push(price);
    }

    if (fieldsToUpdate.length === 0) {
      res.status(400).json({ error: "At least one field (name, quantity, or price) must be provided" });
      return;
    }

    valuesToUpdate.push(id);

    const query = `UPDATE groceries SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;

    const [result] = await pool.execute(query, valuesToUpdate);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: `Grocery item with ID ${id} not found` });
      return;
    }
    res.status(200).json({
      message: `Grocery item with ID ${id} updated successfully`,
      updatedData: {
        id,
        name: name || undefined,
        quantity: quantity !== undefined ? quantity : undefined,
        price: price !== undefined ? price : undefined,
      },
    });
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteGroceryItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM groceries WHERE id = ?";

    const [result] = await pool.execute(query, [id]);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: `Grocery item with ID ${id} not found` });
      return;
    }

    res.status(200).json({
      message: `Grocery item with ID ${id} deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};


