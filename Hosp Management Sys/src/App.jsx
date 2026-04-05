import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [activeTab, setActiveTab] = useState("patients");

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);

  const [patientForm, setPatientForm] = useState({ name: "", age: "", gender: "" });
  const [doctorForm, setDoctorForm] = useState({ name: "", phone: "", department: "", specialization: "" });
  const [appointmentForm, setAppointmentForm] = useState({ appointment_date: "", appointment_time: "", status: "", patient_id: "", doctor_id: "" });
  const [billForm, setBillForm] = useState({ bill_date: "", amount: "", payment_status: "", patient_id: "" });

  // FETCH
  const fetchPatients = () => axios.get("http://localhost:5001/patients").then(res => setPatients(res.data));
  const fetchDoctors = () => axios.get("http://localhost:5001/doctors").then(res => setDoctors(res.data));
  const fetchAppointments = () => axios.get("http://localhost:5001/appointments").then(res => setAppointments(res.data));
  const fetchBills = () => axios.get("http://localhost:5001/bills").then(res => setBills(res.data));

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
    fetchBills();
  }, []);

  // HANDLERS
  const handleChange = (setter, form) => (e) => {
    setter({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (url, form, reset, fetchFn, msg) => (e) => {
    e.preventDefault();
    axios.post(url, form).then(() => {
      alert(msg);
      reset();
      fetchFn();
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Hospital System</h1>
        <div className="space-x-4">
          {["patients", "doctors", "appointments", "billing"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="hover:underline">
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">

        {/* PATIENTS */}
        {activeTab === "patients" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Patients</h2>

            <form onSubmit={submit("http://localhost:5001/patients", patientForm,
              () => setPatientForm({ name: "", age: "", gender: "" }),
              fetchPatients, "Patient Added")}>
              
              <input name="name" placeholder="Name" value={patientForm.name}
                onChange={handleChange(setPatientForm, patientForm)} className="border p-2 w-full mb-2" />

              <input name="age" placeholder="Age" value={patientForm.age}
                onChange={handleChange(setPatientForm, patientForm)} className="border p-2 w-full mb-2" />

              <select name="gender" value={patientForm.gender}
                onChange={handleChange(setPatientForm, patientForm)} className="border p-2 w-full mb-2">
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <button className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
            </form>

            {patients.map(p => (
              <div key={p.patient_id} className="border p-2 mt-2 rounded">
                {p.name} - {p.age}
              </div>
            ))}
          </div>
        )}

        {/* DOCTORS */}
        {activeTab === "doctors" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Doctors</h2>

            <form onSubmit={submit("http://localhost:5001/doctors", doctorForm,
              () => setDoctorForm({ name: "", phone: "", department: "", specialization: "" }),
              fetchDoctors, "Doctor Added")}>

              <input name="name" placeholder="Name" value={doctorForm.name}
                onChange={handleChange(setDoctorForm, doctorForm)} className="border p-2 w-full mb-2" />

              <input name="phone" placeholder="Phone" value={doctorForm.phone}
                onChange={handleChange(setDoctorForm, doctorForm)} className="border p-2 w-full mb-2" />

              <input name="department" placeholder="Department" value={doctorForm.department}
                onChange={handleChange(setDoctorForm, doctorForm)} className="border p-2 w-full mb-2" />

              <input name="specialization" placeholder="Specialization" value={doctorForm.specialization}
                onChange={handleChange(setDoctorForm, doctorForm)} className="border p-2 w-full mb-2" />

              <button className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
            </form>

            {doctors.map(d => (
              <div key={d.doctor_id} className="border p-2 mt-2 rounded">
                {d.name} - {d.department}
              </div>
            ))}
          </div>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Appointments</h2>

            <form onSubmit={submit("http://localhost:5001/appointments", appointmentForm,
              () => setAppointmentForm({ appointment_date: "", appointment_time: "", status: "", patient_id: "", doctor_id: "" }),
              fetchAppointments, "Appointment Added")}>

              <input type="date" name="appointment_date" value={appointmentForm.appointment_date}
                onChange={handleChange(setAppointmentForm, appointmentForm)} className="border p-2 w-full mb-2" />

              <input type="time" name="appointment_time" value={appointmentForm.appointment_time}
                onChange={handleChange(setAppointmentForm, appointmentForm)} className="border p-2 w-full mb-2" />

              <input name="status" placeholder="Status" value={appointmentForm.status}
                onChange={handleChange(setAppointmentForm, appointmentForm)} className="border p-2 w-full mb-2" />

              <select name="patient_id" value={appointmentForm.patient_id}
                onChange={handleChange(setAppointmentForm, appointmentForm)} className="border p-2 w-full mb-2">
                <option>Select Patient</option>
                {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.name}</option>)}
              </select>

              <select name="doctor_id" value={appointmentForm.doctor_id}
                onChange={handleChange(setAppointmentForm, appointmentForm)} className="border p-2 w-full mb-2">
                <option>Select Doctor</option>
                {doctors.map(d => <option key={d.doctor_id} value={d.doctor_id}>{d.name}</option>)}
              </select>

              <button className="bg-purple-500 text-white px-4 py-2 rounded">Book</button>
            </form>

            {appointments.map(a => (
              <div key={a.appointment_id} className="border p-2 mt-2 rounded">
                {a.patient_name} → {a.doctor_name}
              </div>
            ))}
          </div>
        )}

        {/* BILLING */}
        {activeTab === "billing" && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Billing</h2>

            <form onSubmit={submit("http://localhost:5001/bills", billForm,
              () => setBillForm({ bill_date: "", amount: "", payment_status: "", patient_id: "" }),
              fetchBills, "Bill Added")}>

              <input type="date" name="bill_date" value={billForm.bill_date}
                onChange={handleChange(setBillForm, billForm)} className="border p-2 w-full mb-2" />

              <input name="amount" placeholder="Amount" value={billForm.amount}
                onChange={handleChange(setBillForm, billForm)} className="border p-2 w-full mb-2" />

              <input name="payment_status" placeholder="Status" value={billForm.payment_status}
                onChange={handleChange(setBillForm, billForm)} className="border p-2 w-full mb-2" />

              <select name="patient_id" value={billForm.patient_id}
                onChange={handleChange(setBillForm, billForm)} className="border p-2 w-full mb-2">
                <option>Select Patient</option>
                {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.name}</option>)}
              </select>

              <button className="bg-red-500 text-white px-4 py-2 rounded">Generate</button>
            </form>

            {bills.map(b => (
              <div key={b.bill_id} className="border p-2 mt-2 rounded">
                {b.patient_name} - ₹{b.amount}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;