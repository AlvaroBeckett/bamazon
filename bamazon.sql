DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  item_id INT(5) AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(60) NOT NULL,
  price Decimal(10,3) NOT NULL,
  stock_quantity INT(10) NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Amazon Echo", "Amazon Products", 179.00, 120),
("Amazon Echo Dot", "Amazon Products" 49.99, 65),
("Instant Pot 7-in-1 Multi-Functional Pressure Cooker", "Kitchen Appliances", 99.95, 48),
("TechMatte MagGrip Air Vent Magnetic Universal Car Mount", "Tech Accessories", 7.99, 240),
("Fire HD Tablets", "Amazon Products", 109.99, 25),
("Sony XB950B1 Extra Bass Wireless Headphones with App Control", "Music and Audio", 148.00, 50),
("iRobot Roomba 652 Robotic Vacuum Cleaner", "Home Appliances", 374.65, 10),
("Anker Bluetooth SoundBuds Headphones", "Music and Audio", 23.99, 62);
 