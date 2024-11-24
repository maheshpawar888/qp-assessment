
export interface OrderItem {
    id: number;
    order_id: number;
    grocery_id: number;
    quantity: number;
    price: number;
  }

export const OrderItemTable = `
  CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  grocery_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (grocery_id) REFERENCES groceries(id) ON DELETE CASCADE
);`;
