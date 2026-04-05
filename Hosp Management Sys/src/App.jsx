import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);

  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    gender: ""
  });

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    phone: "",
    department: "",
    specialization: ""
  });

  const [appointmentForm, setAppointmentForm] = useState({
    appointment_date: "",
    appointment_time: "",
    status: "",
    patient_id: "",
    doctor_id: ""
  });

  const [billForm, setBillForm] = useState({
    bill_date: "",
    amount: "",
    payment_status: "",
    patient_id: ""
  });

  // FETCH DATA
  const fetchPatients = () => {
    axios.get("http://localhost:5001/patients")
      .then(res => setPatients(res.data));
  };

  const fetchDoctors = () => {
    axios.get("http://localhost:5001/doctors")
      .then(res => setDoctors(res.data));
  };

  const fetchAppointments = () => {
    axios.get("http://localhost:5001/appointments")
      .then(res => setAppointments(res.data));
  };

  const fetchBills = () => {
    axios.get("http://localhost:5001/bills")
      .then(res => setBills(res.data));
  };

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
    fetchBills();
  }, []);

  // HANDLE INPUT
  const handlePatientChange = (e) => {
    setPatientForm({ ...patientForm, [e.target.name]: e.target.value });
  };

  const handleDoctorChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const handleAppointmentChange = (e) => {
    setAppointmentForm({ ...appointmentForm, [e.target.name]: e.target.value });
  };

  const handleBillChange = (e) => {
    setBillForm({ ...billForm, [e.target.name]: e.target.value });
  };

  // SUBMIT
  const handlePatientSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5001/patients", patientForm)
      .then(() => {
        alert("Patient Added ✅");
        setPatientForm({ name: "", age: "", gender: "" });
        fetchPatients();
      });
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5001/doctors", doctorForm)
      .then(() => {
        alert("Doctor Added ✅");
        setDoctorForm({
          name: "",
          phone: "",
          department: "",
          specialization: ""
        });
        fetchDoctors();
      });
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5001/appointments", appointmentForm)
      .then(() => {
        alert("Appointment Added ✅");
        setAppointmentForm({
          appointment_date: "",
          appointment_time: "",
          status: "",
          patient_id: "",
          doctor_id: ""
        });
        fetchAppointments();
      });
  };

  const handleBillSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5001/bills", billForm)
      .then(() => {
        alert("Bill Added ✅");
        setBillForm({
          bill_date: "",
          amount: "",
          payment_status: "",
          patient_id: ""
        });
        fetchBills();
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Hospital Management System
      </h1>

      {/* PATIENT FORM */}
      <form onSubmit={handlePatientSubmit} className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Patient</h2>

        <input name="name" placeholder="Name" value={patientForm.name} onChange={handlePatientChange} className="border p-2 w-full mb-2" required />
        <input name="age" placeholder="Age" value={patientForm.age} onChange={handlePatientChange} className="border p-2 w-full mb-2" required />
        <select name="gender" value={patientForm.gender} onChange={handlePatientChange} className="border p-2 w-full mb-2" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Patient
        </button>
      </form>

      {/* DOCTOR FORM */}
      <form onSubmit={handleDoctorSubmit} className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Doctor</h2>

        <input name="name" placeholder="Name" value={doctorForm.name} onChange={handleDoctorChange} className="border p-2 w-full mb-2" required />
        <input name="phone" placeholder="Phone" value={doctorForm.phone} onChange={handleDoctorChange} className="border p-2 w-full mb-2" required />
        <input name="department" placeholder="Department" value={doctorForm.department} onChange={handleDoctorChange} className="border p-2 w-full mb-2" required />
        <input name="specialization" placeholder="Specialization" value={doctorForm.specialization} onChange={handleDoctorChange} className="border p-2 w-full mb-2" required />

        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Add Doctor
        </button>
      </form>

      {/* APPOINTMENT FORM */}
      <form onSubmit={handleAppointmentSubmit} className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Book Appointment</h2>

        <input type="date" name="appointment_date" value={appointmentForm.appointment_date} onChange={handleAppointmentChange} className="border p-2 w-full mb-2" required />
        <input type="time" name="appointment_time" value={appointmentForm.appointment_time} onChange={handleAppointmentChange} className="border p-2 w-full mb-2" required />
        <input name="status" placeholder="Status" value={appointmentForm.status} onChange={handleAppointmentChange} className="border p-2 w-full mb-2" required />

        <select name="patient_id" value={appointmentForm.patient_id} onChange={handleAppointmentChange} className="border p-2 w-full mb-2" required>
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
          ))}
        </select>

        <select name="doctor_id" value={appointmentForm.doctor_id} onChange={handleAppointmentChange} className="border p-2 w-full mb-2" required>
          <option value="">Select Doctor</option>
          {doctors.map(d => (
            <option key={d.doctor_id} value={d.doctor_id}>{d.name}</option>
          ))}
        </select>

        <button className="bg-purple-500 text-white px-4 py-2 rounded">
          Book Appointment
        </button>
      </form>

      {/* BILL FORM */}
      <form onSubmit={handleBillSubmit} className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Generate Bill</h2>

        <input type="date" name="bill_date" value={billForm.bill_date} onChange={handleBillChange} className="border p-2 w-full mb-2" required />
        <input type="number" name="amount" placeholder="Amount" value={billForm.amount} onChange={handleBillChange} className="border p-2 w-full mb-2" required />
        <input name="payment_status" placeholder="Payment Status" value={billForm.payment_status} onChange={handleBillChange} className="border p-2 w-full mb-2" required />

        <select name="patient_id" value={billForm.patient_id} onChange={handleBillChange} className="border p-2 w-full mb-2" required>
          <option value="">Select Patient</option>
          {patients.map(p => (
            <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
          ))}
        </select>

        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Generate Bill
        </button>
      </form>

      {/* APPOINTMENTS LIST */}
      <h2 className="text-xl font-semibold mb-2">Appointments</h2>
      {appointments.map(a => (
        <div key={a.appointment_id} className="border p-2 mb-2 rounded">
          {a.patient_name} → {a.doctor_name} | {a.appointment_date} | {a.appointment_time} | {a.status}
        </div>
      ))}

      {/* BILLS LIST */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Bills</h2>
      {bills.map(b => (
        <div key={b.bill_id} className="border p-2 mb-2 rounded">
          {b.patient_name} | ₹{b.amount} | {b.payment_status} | {b.bill_date}
        </div>
      ))}

    </div>
  );
}

export default App;