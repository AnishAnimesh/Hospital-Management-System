import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/patients")
      .then(res => setPatients(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Patients</h1>

      {patients.map(p => (
        <div key={p.patient_id} className="border p-2 mt-2">
          {p.name} - {p.age} - {p.gender}
        </div>
      ))}
    </div>
  );
}

export default App;