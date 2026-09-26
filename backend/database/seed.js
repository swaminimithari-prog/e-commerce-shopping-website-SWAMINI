// seed.js
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        phone: "9999999999",
        address: "Admin Address",
        isAdmin: true,
      },
      {
        name: "Chetan User",
        email: "user@example.com",
        password: hashedPassword,
        phone: "8888888888",
        address: "User Address",
        isAdmin: false,
      },
    ]);

    const adminUser = users[0]._id;

    await Product.insertMany([
      {
        user: adminUser,
        name: "iPhone 15",
        description: "Latest Apple smartphone with advanced features",
        price: 79999,
        category: "Mobiles",
        brand: "Apple",
        stock: 10,
        image: "iphone15.jpg",
      },
      {
        user: adminUser,
        name: "Samsung Galaxy S24",
        description: "Flagship Samsung smartphone",
        price: 69999,
        category: "Mobiles",
        brand: "Samsung",
        stock: 15,
        image: "galaxy-s24.jpg",
      },
      {
        user: adminUser,
        name: "Nike Running Shoes",
        description: "Comfortable sports running shoes",
        price: 4999,
        category: "Fashion",
        brand: "Nike",
        stock: 20,
        image: "nike-shoes.jpg",
      },
      {
        user: adminUser,
        name: "HP Laptop",
        description: "Powerful laptop for work and study",
        price: 55999,
        category: "Electronics",
        brand: "HP",
        stock: 8,
        image: "hp-laptop.jpg",
      },
      {
        user: adminUser,
        name: "Boat Headphones",
        description: "Wireless over-ear headphones",
        price: 2999,
        category: "Accessories",
        brand: "Boat",
        stock: 25,
        image: "boat-headphones.jpg",
      },
    ]);

    console.log("Sample data inserted");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Sample data removed");
    process.exit();
  } catch (error) {
    console.error("Destroy error:", error.message);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}