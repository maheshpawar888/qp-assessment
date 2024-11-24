export interface Grocery {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export const GroceryTable = `
    CREATE TABLE IF NOT EXISTS groceries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      quantity INT NOT NULL
    );
  `;
