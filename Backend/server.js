const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "An34&#il",
  database: "hospital_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});


// 👇 PUT YOUR API CODE HERE 👇

// GET all patients
app.get("/patients", (req, res) => {
  db.query("SELECT * FROM patients", (err, result) => {
    if (err) res.send(err);
    else res.json(result);
  });
});

// ADD patient
app.post("/patients", (req, res) => {
  const { name, age, gender } = req.body;
  db.query(
    "INSERT INTO patients (name, age, gender) VALUES (?, ?, ?)",
    [name, age, gender],
    (err, result) => {
      if (err) res.send(err);
      else res.send("Patient Added");
    }
  );
});


// Server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});