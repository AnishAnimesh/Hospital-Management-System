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

// DELETE patient
app.delete("/patients/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "DELETE FROM patients WHERE patient_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("Patient Deleted ✅");
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

// UPDATE appointment status
app.put("/appointments/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE appointment SET status = ? WHERE appointment_id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("Appointment Status Updated ✅");
      }
    }
  );
});

// GET all bills
app.get("/bills", (req, res) => {
  const query = `
    SELECT b.bill_id, b.bill_date, b.amount, b.payment_status,
           p.name AS patient_name
    FROM bill b
    JOIN patients p ON b.patient_id = p.patient_id
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

// ADD bill
app.post("/bills", (req, res) => {
  const { bill_date, amount, payment_status, patient_id } = req.body;
  db.query(
    "INSERT INTO bill (bill_date, amount, payment_status, patient_id) VALUES (?, ?, ?, ?)",
    [bill_date, amount, payment_status, patient_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("Bill Added ✅");
      }
    }
  );
});

// START SERVER — always at the end
app.listen(5001, () => {
  console.log("Running on port 5001");
});