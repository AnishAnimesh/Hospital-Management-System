import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

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

  // FETCH DATA
  const fetchPatients = () => {
    axios.get("http://localhost:5001/patients")
      .then(res => setPatients(res.data));
  };

  const fetchDoctors = () => {
    axios.get("http://localhost:5001/doctors")
      .then(res => setDoctors(res.data));
  };

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  // HANDLE INPUT
  const handlePatientChange = (e) => {
    setPatientForm({ ...patientForm, [e.target.name]: e.target.value });
  };

  const handleDoctorChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
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

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-3xl font-bold mb-4">Hospital Management</h1>

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

      {/* DOCTOR LIST */}
      <h2 className="text-xl font-semibold mb-2">Doctors</h2>

      {doctors.map(d => (
        <div key={d.doctor_id} className="border p-2 mb-2 rounded">
          {d.name} - {d.department} - {d.specialization}
        </div>
      ))}

    </div>
  );
}

export default App;