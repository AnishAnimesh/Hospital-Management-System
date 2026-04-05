import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: ""
  });

  // Fetch patients
  const fetchPatients = () => {
    axios.get("http://localhost:5001/patients")
      .then(res => setPatients(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5001/patients", form)
      .then(() => {
        alert("Patient Added ✅");
        setForm({ name: "", age: "", gender: "" });
        fetchPatients(); // refresh list
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      
      <h1 className="text-3xl font-bold mb-4">Hospital Management</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Patient</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Patient
        </button>
      </form>

      {/* LIST */}
      <h2 className="text-xl font-semibold mb-2">Patients List</h2>

      {patients.map(p => (
        <div key={p.patient_id} className="border p-2 mb-2 rounded">
          {p.name} - {p.age} - {p.gender}
        </div>
      ))}
    </div>
  );
}

export default App;