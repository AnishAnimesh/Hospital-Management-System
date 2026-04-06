import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users, UserCheck, CalendarDays, Receipt, LayoutDashboard,
  Bell, Search, ChevronDown, Plus, X, Menu, LogOut,
  Phone, Stethoscope, Clock, TrendingUp,
  Activity, ChevronRight, Settings, User, Pencil, Trash2,
  AlertTriangle
} from "lucide-react";

// ─── Department → Specializations map ────────────────────────────────────────
const DEPARTMENT_SPECIALIZATIONS = {
  "Cardiology":         ["Interventional Cardiology", "Electrophysiology", "Heart Failure", "Cardiac Imaging"],
  "Neurology":          ["Stroke & Cerebrovascular", "Epilepsy", "Movement Disorders", "Neuro-oncology"],
  "Orthopedics":        ["Joint Replacement", "Spine Surgery", "Sports Medicine", "Pediatric Orthopedics"],
  "Pediatrics":         ["Neonatology", "Pediatric Cardiology", "Pediatric Neurology", "General Pediatrics"],
  "Gynecology":         ["Obstetrics", "Reproductive Medicine", "Gynecologic Oncology", "Urogynecology"],
  "Dermatology":        ["Cosmetic Dermatology", "Pediatric Dermatology", "Dermatopathology", "Mohs Surgery"],
  "Ophthalmology":      ["Retina & Vitreous", "Glaucoma", "Cornea & External Disease", "Cataract Surgery"],
  "ENT":                ["Rhinology", "Otology", "Head & Neck Surgery", "Laryngology"],
  "Gastroenterology":   ["Hepatology", "Endoscopy", "Inflammatory Bowel Disease", "Pancreatic Disorders"],
  "Pulmonology":        ["Critical Care", "Sleep Medicine", "Interventional Pulmonology", "Asthma & Allergy"],
  "Urology":            ["Robotic Surgery", "Urologic Oncology", "Female Urology", "Pediatric Urology"],
  "Oncology":           ["Medical Oncology", "Radiation Oncology", "Surgical Oncology", "Hematology"],
  "Psychiatry":         ["Child Psychiatry", "Addiction Medicine", "Geriatric Psychiatry", "Forensic Psychiatry"],
  "Radiology":          ["Interventional Radiology", "Neuroradiology", "Musculoskeletal Radiology", "Nuclear Medicine"],
  "Anesthesiology":     ["Cardiac Anesthesia", "Pediatric Anesthesia", "Pain Management", "Neuroanesthesia"],
  "Emergency Medicine": ["Trauma", "Toxicology", "Disaster Medicine", "Pediatric Emergency"],
  "General Surgery":    ["Laparoscopic Surgery", "Bariatric Surgery", "Colorectal Surgery", "Vascular Surgery"],
  "Nephrology":         ["Dialysis", "Kidney Transplant", "Glomerular Disease", "Hypertension"],
  "Endocrinology":      ["Diabetes & Metabolism", "Thyroid Disorders", "Pituitary Disorders", "Bone & Mineral"],
  "Rheumatology":       ["Autoimmune Disease", "Inflammatory Arthritis", "Osteoporosis", "Vasculitis"],
};
const DEPARTMENTS = Object.keys(DEPARTMENT_SPECIALIZATIONS);

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Scheduled:  { bg: "bg-blue-50",   text: "text-blue-700",  dot: "bg-blue-500"  },
  Completed:  { bg: "bg-green-50",  text: "text-green-700", dot: "bg-green-500" },
  Cancelled:  { bg: "bg-red-50",    text: "text-red-700",   dot: "bg-red-500"   },
  Pending:    { bg: "bg-amber-50",  text: "text-amber-700", dot: "bg-amber-500" },
  Paid:       { bg: "bg-green-50",  text: "text-green-700", dot: "bg-green-500" },
  Unpaid:     { bg: "bg-red-50",    text: "text-red-700",   dot: "bg-red-500"   },
  Male:       { bg: "bg-blue-50",   text: "text-blue-700",  dot: "bg-blue-400"  },
  Female:     { bg: "bg-pink-50",   text: "text-pink-700",  dot: "bg-pink-400"  },
  Other:      { bg: "bg-gray-100",  text: "text-gray-600",  dot: "bg-gray-400"  },
};

// ─── Reusable components ──────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = STATUS_COLORS[status] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all duration-200">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon size={22} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
      {trend && <p className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1"><TrendingUp size={11}/>{trend}</p>}
    </div>
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
          <X size={16} className="text-slate-600" />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-slate-700">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────
const ConfirmDelete = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
      <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={22} className="text-rose-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">Confirm Delete</h3>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─── Table ────────────────────────────────────────────────────────────────────
const Table = ({ cols, rows, emptyMsg = "No records found" }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-100">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-100">
          {cols.map(c => (
            <th key={c} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {rows.length === 0
          ? <tr><td colSpan={cols.length} className="text-center py-10 text-slate-400">{emptyMsg}</td></tr>
          : rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/70 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-slate-700 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

// ─── Patients Section (with Delete) ──────────────────────────────────────────
const PatientsSection = ({ patients, fetchPatients }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "" });
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5001/patients", form).then(() => {
      setForm({ name: "", age: "", gender: "" });
      setOpen(false);
      fetchPatients();
    });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:5001/patients/${deleteTarget.id}`)
      .then(() => { setDeleteTarget(null); fetchPatients(); })
      .catch(() => setDeleteTarget(null));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Patients</h2>
          <p className="text-sm text-slate-500 mt-0.5">{patients.length} total registered patients</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patients…"
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" />
          </div>
          <button onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={16} /> Add Patient
          </button>
        </div>
      </div>

      <Table
        cols={["#", "Name", "Age", "Gender", "Action"]}
        rows={filtered.map((p) => [
          <span className="text-slate-400 font-mono text-xs">{String(p.patient_id).padStart(3, "0")}</span>,
          <span className="font-medium">{p.name}</span>,
          p.age,
          <StatusBadge status={p.gender} />,
          <button
            onClick={() => setDeleteTarget({ id: p.patient_id, name: p.name })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
        ])}
        emptyMsg="No patients found"
      />

      {/* Add Patient Modal */}
      {open && (
        <Modal title="Register New Patient" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name">
              <input className={inputCls} placeholder="e.g. Priya Sharma" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="Age">
              <input className={inputCls} type="number" placeholder="e.g. 35" value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })} required />
            </Field>
            <Field label="Gender">
              <select className={inputCls} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">Register</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDelete
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

// ─── Doctors Section ──────────────────────────────────────────────────────────
const DoctorsSection = ({ doctors, fetchDoctors }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", department: "", specialization: "" });
  const [search, setSearch] = useState("");

  const availableSpecializations = form.department
    ? DEPARTMENT_SPECIALIZATIONS[form.department] || []
    : [];

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.department || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDepartmentChange = (e) => {
    setForm({ ...form, department: e.target.value, specialization: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5001/doctors", form).then(() => {
      setForm({ name: "", phone: "", department: "", specialization: "" });
      setOpen(false);
      fetchDoctors();
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Doctors</h2>
          <p className="text-sm text-slate-500 mt-0.5">{doctors.length} doctors on staff</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search doctors…"
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" />
          </div>
          <button onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus size={16} /> Add Doctor
          </button>
        </div>
      </div>

      <Table
        cols={["#", "Name", "Department", "Specialization", "Phone"]}
        rows={filtered.map((d) => [
          <span className="text-slate-400 font-mono text-xs">{String(d.doctor_id).padStart(3, "0")}</span>,
          <span className="font-medium">{d.name}</span>,
          <span className="text-blue-600 text-xs font-medium bg-blue-50 px-2.5 py-0.5 rounded-full">{d.department}</span>,
          d.specialization,
          <span className="flex items-center gap-1.5 text-slate-500"><Phone size={13} />{d.phone}</span>
        ])}
        emptyMsg="No doctors found"
      />

      {open && (
        <Modal title="Add New Doctor" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name">
              <input className={inputCls} placeholder="e.g. Dr. Arjun Mehta" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="Phone">
              <input className={inputCls} placeholder="e.g. +91 98765 43210" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Department">
              <select className={inputCls} value={form.department} onChange={handleDepartmentChange} required>
                <option value="">Select department</option>
                {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </Field>
            <Field label="Specialization">
              <select
                className={`${inputCls} ${!form.department ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}`}
                value={form.specialization}
                onChange={e => setForm({ ...form, specialization: e.target.value })}
                disabled={!form.department}
                required
              >
                <option value="">{form.department ? "Select specialization" : "Select a department first"}</option>
                {availableSpecializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
              {!form.department && (
                <p className="text-xs text-slate-400 mt-1">↑ Choose a department to unlock specializations</p>
              )}
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">Add Doctor</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ─── Appointments Section (with Edit Status) ──────────────────────────────────
const APPOINTMENT_STATUSES = ["Scheduled", "Completed", "Cancelled"];

const AppointmentsSection = ({ appointments, patients, doctors, fetchAppointments }) => {
  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // appointment object being edited
  const [form, setForm] = useState({ appointment_date: "", appointment_time: "", status: "Scheduled", patient_id: "", doctor_id: "" });
  const [editStatus, setEditStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5001/appointments", form).then(() => {
      setForm({ appointment_date: "", appointment_time: "", status: "Scheduled", patient_id: "", doctor_id: "" });
      setOpen(false);
      fetchAppointments();
    });
  };

  // Open edit modal pre-filled with current appointment status
  const openEdit = (appt) => {
    setEditTarget(appt);
    setEditStatus(appt.status);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5001/appointments/${editTarget.appointment_id}`, { status: editStatus })
      .then(() => { setEditTarget(null); fetchAppointments(); })
      .catch(() => setEditTarget(null));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Appointments</h2>
          <p className="text-sm text-slate-500 mt-0.5">{appointments.length} total appointments</p>
        </div>
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm self-start">
          <Plus size={16} /> Book Appointment
        </button>
      </div>

      <Table
        cols={["Patient", "Doctor", "Date", "Time", "Status", "Action"]}
        rows={appointments.map(a => [
          <span className="font-medium">{a.patient_name}</span>,
          <span className="flex items-center gap-1.5"><Stethoscope size={13} className="text-slate-400" />{a.doctor_name}</span>,
          <span className="flex items-center gap-1.5 text-slate-600"><CalendarDays size={13} className="text-slate-400" />{a.appointment_date}</span>,
          <span className="flex items-center gap-1.5 text-slate-600"><Clock size={13} className="text-slate-400" />{a.appointment_time}</span>,
          <StatusBadge status={a.status} />,
          <button
            onClick={() => openEdit(a)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 transition-colors"
          >
            <Pencil size={13} /> Edit Status
          </button>
        ])}
        emptyMsg="No appointments found"
      />

      {/* Book Appointment Modal */}
      {open && (
        <Modal title="Book New Appointment" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Patient">
              <select className={inputCls} value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} required>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="Doctor">
              <select className={inputCls} value={form.doctor_id} onChange={e => setForm({ ...form, doctor_id: e.target.value })} required>
                <option value="">Select doctor</option>
                {doctors.map(d => <option key={d.doctor_id} value={d.doctor_id}>{d.name} — {d.department}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date">
                <input type="date" className={inputCls} value={form.appointment_date}
                  onChange={e => setForm({ ...form, appointment_date: e.target.value })} required />
              </Field>
              <Field label="Time">
                <input type="time" className={inputCls} value={form.appointment_time}
                  onChange={e => setForm({ ...form, appointment_time: e.target.value })} required />
              </Field>
            </div>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {APPOINTMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">Book</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Status Modal */}
      {editTarget && (
        <Modal title="Edit Appointment Status" onClose={() => setEditTarget(null)}>
          <form onSubmit={handleEditSubmit} className="space-y-5">
            {/* Read-only summary */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Patient</span>
                <span className="font-medium text-slate-800">{editTarget.patient_name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Doctor</span>
                <span className="font-medium text-slate-800">{editTarget.doctor_name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-medium text-slate-800">{editTarget.appointment_date} at {editTarget.appointment_time}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-200">
                <span className="text-slate-500">Current Status</span>
                <StatusBadge status={editTarget.status} />
              </div>
            </div>

            <Field label="Update Status To">
              <div className="grid grid-cols-3 gap-2">
                {APPOINTMENT_STATUSES.map(s => {
                  const active = editStatus === s;
                  const colors = {
                    Scheduled: active ? "bg-blue-600 text-white border-blue-600" : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600",
                    Completed: active ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600",
                    Cancelled: active ? "bg-rose-600 text-white border-rose-600" : "border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-600",
                  };
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditStatus(s)}
                      className={`py-2.5 rounded-xl border text-sm font-medium transition-all ${colors[s]}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setEditTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={editStatus === editTarget.status}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ─── Billing Section ──────────────────────────────────────────────────────────
const BillingSection = ({ bills, patients, fetchBills }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ bill_date: "", amount: "", payment_status: "Unpaid", patient_id: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5001/bills", form).then(() => {
      setForm({ bill_date: "", amount: "", payment_status: "Unpaid", patient_id: "" });
      setOpen(false);
      fetchBills();
    });
  };

  const total = bills.reduce((s, b) => s + parseFloat(b.amount || 0), 0);
  const paid = bills.filter(b => b.payment_status === "Paid").reduce((s, b) => s + parseFloat(b.amount || 0), 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Billing</h2>
          <p className="text-sm text-slate-500 mt-0.5">{bills.length} bills · ₹{paid.toLocaleString()} collected</p>
        </div>
        <button onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm self-start">
          <Plus size={16} /> Generate Bill
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Total Collected</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">₹{paid.toLocaleString()}</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
          <p className="text-xs text-rose-600 font-semibold uppercase tracking-wider">Outstanding</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">₹{(total - paid).toLocaleString()}</p>
        </div>
      </div>

      <Table
        cols={["Patient", "Date", "Amount", "Status"]}
        rows={bills.map(b => [
          <span className="font-medium">{b.patient_name}</span>,
          <span className="flex items-center gap-1.5 text-slate-600"><CalendarDays size={13} className="text-slate-400" />{b.bill_date}</span>,
          <span className="font-semibold text-slate-800">₹{parseFloat(b.amount).toLocaleString()}</span>,
          <StatusBadge status={b.payment_status} />
        ])}
        emptyMsg="No bills found"
      />

      {open && (
        <Modal title="Generate Bill" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Patient">
              <select className={inputCls} value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} required>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.name}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bill Date">
                <input type="date" className={inputCls} value={form.bill_date}
                  onChange={e => setForm({ ...form, bill_date: e.target.value })} required />
              </Field>
              <Field label="Amount (₹)">
                <input type="number" className={inputCls} placeholder="e.g. 1500" value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })} required />
              </Field>
            </div>
            <Field label="Payment Status">
              <select className={inputCls} value={form.payment_status} onChange={e => setForm({ ...form, payment_status: e.target.value })}>
                <option>Unpaid</option>
                <option>Paid</option>
                <option>Pending</option>
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors">Generate</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ─── Overview ─────────────────────────────────────────────────────────────────
const OverviewSection = ({ patients, doctors, appointments, bills, setActiveTab }) => {
  const recent = appointments.slice(-5).reverse();
  const total = bills.reduce((s, b) => s + parseFloat(b.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-sm text-slate-500 mt-0.5">Welcome back — here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Patients" value={patients.length} color="bg-blue-500" trend="Active records" />
        <StatCard icon={UserCheck} label="Doctors" value={doctors.length} color="bg-emerald-500" trend="On staff" />
        <StatCard icon={CalendarDays} label="Appointments" value={appointments.length} color="bg-violet-500" trend="Total booked" />
        <StatCard icon={Receipt} label="Revenue" value={`₹${total.toLocaleString()}`} color="bg-rose-500" trend="All time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Recent Appointments</h3>
            <button onClick={() => setActiveTab("appointments")} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ChevronRight size={13} />
            </button>
          </div>
          {recent.length === 0
            ? <p className="text-sm text-slate-400 text-center py-6">No appointments yet</p>
            : <div className="space-y-3">
              {recent.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{a.patient_name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Stethoscope size={11} />{a.doctor_name} · {a.appointment_date}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          }
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Appointment Status</h3>
          {["Scheduled", "Completed", "Cancelled"].map(status => {
            const count = appointments.filter(a => a.status === status).length;
            const pct = appointments.length ? Math.round((count / appointments.length) * 100) : 0;
            const bar = { Scheduled: "bg-blue-500", Completed: "bg-emerald-500", Cancelled: "bg-rose-400" };
            return (
              <div key={status} className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-slate-600">{status}</span>
                  <span className="text-sm font-semibold text-slate-800">{count} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${bar[status]} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Billing Summary</h4>
            <div className="grid grid-cols-2 gap-3">
              {["Paid", "Unpaid"].map(status => (
                <div key={status} className={`rounded-xl p-3 ${status === "Paid" ? "bg-emerald-50" : "bg-rose-50"}`}>
                  <p className={`text-xs font-medium ${status === "Paid" ? "text-emerald-600" : "text-rose-600"}`}>{status}</p>
                  <p className={`text-lg font-bold mt-0.5 ${status === "Paid" ? "text-emerald-700" : "text-rose-700"}`}>
                    {bills.filter(b => b.payment_status === status).length}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview",     label: "Overview",     icon: LayoutDashboard },
  { id: "patients",     label: "Patients",     icon: Users },
  { id: "doctors",      label: "Doctors",      icon: UserCheck },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "billing",      label: "Billing",      icon: Receipt },
];

const Sidebar = ({ active, setActive, open, setOpen }) => (
  <>
    {open && <div className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`
      fixed top-0 left-0 h-full z-40 w-64 bg-slate-900 flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${open ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:static lg:z-auto
    `}>
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Activity size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">MediCore</p>
          <p className="text-slate-500 text-xs">Hospital System</p>
        </div>
        <button onClick={() => setOpen(false)} className="ml-auto lg:hidden text-slate-500 hover:text-white">
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => { setActive(id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
              <Icon size={18} />{label}
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </button>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
          <Settings size={17} /> Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors mt-0.5">
          <LogOut size={17} /> Sign out
        </button>
      </div>
    </aside>
  </>
);

// ─── Topbar ───────────────────────────────────────────────────────────────────
const Topbar = ({ active, onMenuToggle }) => {
  const title = NAV.find(n => n.id === active)?.label || "Dashboard";
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50">
          <Menu size={18} />
        </button>
        <h1 className="text-base font-semibold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
        <div className="flex items-center gap-2 ml-1 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <User size={15} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 leading-tight">Admin</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);

  const fetchPatients     = () => axios.get("http://localhost:5001/patients").then(r => setPatients(r.data)).catch(() => {});
  const fetchDoctors      = () => axios.get("http://localhost:5001/doctors").then(r => setDoctors(r.data)).catch(() => {});
  const fetchAppointments = () => axios.get("http://localhost:5001/appointments").then(r => setAppointments(r.data)).catch(() => {});
  const fetchBills        = () => axios.get("http://localhost:5001/bills").then(r => setBills(r.data)).catch(() => {});

  useEffect(() => {
    fetchPatients(); fetchDoctors(); fetchAppointments(); fetchBills();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar active={activeTab} setActive={setActiveTab} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar active={activeTab} onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-6xl mx-auto">
            {activeTab === "overview"      && <OverviewSection patients={patients} doctors={doctors} appointments={appointments} bills={bills} setActiveTab={setActiveTab} />}
            {activeTab === "patients"      && <PatientsSection patients={patients} fetchPatients={fetchPatients} />}
            {activeTab === "doctors"       && <DoctorsSection doctors={doctors} fetchDoctors={fetchDoctors} />}
            {activeTab === "appointments"  && <AppointmentsSection appointments={appointments} patients={patients} doctors={doctors} fetchAppointments={fetchAppointments} />}
            {activeTab === "billing"       && <BillingSection bills={bills} patients={patients} fetchBills={fetchBills} />}
          </div>
        </main>
      </div>
    </div>
  );
}