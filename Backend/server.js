const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "An34&#il",
  database: "hospital_db"
});

db.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server working ✅");
});

// GET all patients
app.get("/patients", (req, res) => {
  db.query("SELECT * FROM patients", (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

// 👇 THIS WAS MISSING
app.listen(5001, () => {
  console.log("Running on port 5001");
});

// ADD patient
app.post("/patients", (req, res) => {
  const { name, age, gender } = req.body;

  db.query(
    "INSERT INTO patients (name, age, gender) VALUES (?, ?, ?)",
    [name, age, gender],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("Patient Added ✅");
      }
    }
  );
});

// GET all doctors
app.get("/doctors", (req, res) => {
  db.query("SELECT * FROM doctor", (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

// ADD doctor
app.post("/doctors", (req, res) => {
  const { name, phone, department, specialization } = req.body;

  db.query(
    "INSERT INTO doctor (name, phone, department, specialization) VALUES (?, ?, ?, ?)",
    [name, phone, department, specialization],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("Doctor Added ✅");
      }
    }
  );
});

// GET all appointments
app.get("/appointments", (req, res) => {
  const query = `
    SELECT a.appointment_id, a.appointment_date, a.appointment_time, a.status,
           p.name AS patient_name,
           d.name AS doctor_name
    FROM appointment a
    JOIN patients p ON a.patient_id = p.patient_id
    JOIN doctor d ON a.doctor_id = d.doctor_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

// ADD appointment
app.post("/appointments", (req, res) => {
  const { appointment_date, appointment_time, status, patient_id, doctor_id } = req.body;

  db.query(
    "INSERT INTO appointment (appointment_date, appointment_time, status, patient_id, doctor_id) VALUES (?, ?, ?, ?, ?)",
    [appointment_date, appointment_time, status, patient_id, doctor_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("Appointment Added ✅");
      }
    }
  );
});