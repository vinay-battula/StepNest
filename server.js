const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vinay@17",
  database: "stepnest",
});

// connect database
db.connect((err) => {
  if (err) {
    console.log("Database Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("StepNest Backend Running");
});

// ================= PRODUCTS =================

// Get products
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

// ================= LOGIN =================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      res.send(err);
    } else if (result.length > 0) {
      const user = result[0];

      // update login status
      const update = "UPDATE users SET is_logged_in=true WHERE id=?";
      db.query(update, [user.id]);

      res.json({
        message: "Login Success",
        role: user.role,
        userId: user.id,
      });
    } else {
      res.json({ message: "Invalid Login" });
    }
  });
});

// ================= LOGOUT =================

app.post("/logout", (req, res) => {
  const { userId } = req.body;

  const sql = "UPDATE users SET is_logged_in=false WHERE id=?";

  db.query(sql, [userId], (err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Logout Success");
    }
  });
});

// ================= ADD CART =================

app.post("/add-cart", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const sql = "INSERT INTO cart(user_id,product_id,quantity) VALUES(?,?,?)";

  db.query(sql, [user_id, product_id, quantity], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Added to Cart");
    }
  });
});

// ================= SERVER =================

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.get("/total-users", (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM users";

  db.query(sql, (err, result) => {
    res.json(result[0]);
  });
});

app.get("/active-users", (req, res) => {
  const sql = "SELECT COUNT(*) AS active FROM users WHERE is_logged_in=true";

  db.query(sql, (err, result) => {
    res.json(result[0]);
  });
});

app.get("/total-products", (req, res) => {
  const sql = "SELECT COUNT(*) AS products FROM products";

  db.query(sql, (err, result) => {
    res.json(result[0]);
  });
});

app.post("/product-view", (req, res) => {
  const { productId } = req.body;

  const sql = "UPDATE products SET views=views+1 WHERE id=?";

  db.query(sql, [productId]);

  res.send("view updated");
});

app.get("/total-views", (req, res) => {
  const sql = "SELECT SUM(views) AS views FROM products";

  db.query(sql, (err, result) => {
    res.json(result[0]);
  });
});
