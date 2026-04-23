import { useState } from "react";
import {
  Plus,
  X,
  Clock,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "./Timetable.css";

// ── Constants ─────────────────────────────────────────────────────
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const CLASS_COLORS = [
  { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af" },
  { bg: "#d1fae5", border: "#6ee7b7", text: "#065f46" },
  { bg: "#fce7f3", border: "#f9a8d4", text: "#9d174d" },
  { bg: "#ede9fe", border: "#c4b5fd", text: "#5b21b6" },
  { bg: "#fef3c7", border: "#fcd34d", text: "#92400e" },
  { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b" },
  { bg: "#e0f2fe", border: "#7dd3fc", text: "#0c4a6e" },
];

// ── Helpers ───────────────────────────────────────────────────────
const generateId = () => Math.random().toString(36).slice(2, 10);

const formatTime = (time) => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
};

// ── Empty class entry template ────────────────────────────────────
const emptyClass = () => ({
  id: generateId(),
  subject: "",
  location: "",
  day: "Monday",
  startTime: "08:00",
  endTime: "09:00",
  colorIdx: 0,
});

// ── Class Form Row ────────────────────────────────────────────────
const ClassRow = ({ cls, onChange, onRemove, index }) => (
  <div className="class-row">
    <div className="class-row-top">
      <div
        className="color-indicator"
        style={{ backgroundColor: CLASS_COLORS[cls.colorIdx].border }}
      />
      <span className="class-row-num">Class {index + 1}</span>
      <button className="btn-remove-class" onClick={() => onRemove(cls.id)}>
        <X size={14} />
      </button>
    </div>

    <div className="class-row-fields">
      <div className="field-group">
        <label>Subject</label>
        <input
          value={cls.subject}
          onChange={(e) => onChange(cls.id, "subject", e.target.value)}
          placeholder="e.g. Data Structures"
          maxLength={60}
        />
      </div>

      <div className="field-group">
        <label>Location</label>
        <input
          value={cls.location}
          onChange={(e) => onChange(cls.id, "location", e.target.value)}
          placeholder="e.g. Room 204"
          maxLength={60}
        />
      </div>

      <div className="field-group">
        <label>Day</label>
        <select
          value={cls.day}
          onChange={(e) => onChange(cls.id, "day", e.target.value)}
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="field-group">
        <label>Start Time</label>
        <select
          value={cls.startTime}
          onChange={(e) => onChange(cls.id, "startTime", e.target.value)}
        >
          {TIME_SLOTS.map((t) => (
            <option key={t} value={t}>
              {formatTime(t)}
            </option>
          ))}
        </select>
      </div>

      <div className="field-group">
        <label>End Time</label>
        <select
          value={cls.endTime}
          onChange={(e) => onChange(cls.id, "endTime", e.target.value)}
        >
          {TIME_SLOTS.filter((t) => t > cls.startTime).map((t) => (
            <option key={t} value={t}>
              {formatTime(t)}
            </option>
          ))}
        </select>
      </div>

      <div className="field-group">
        <label>Color</label>
        <div className="color-picker">
          {CLASS_COLORS.map((c, i) => (
            <button
              key={i}
              className={`color-dot ${cls.colorIdx === i ? "color-dot--active" : ""}`}
              style={{ backgroundColor: c.border }}
              onClick={() => onChange(cls.id, "colorIdx", i)}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── Create Timetable Modal ────────────────────────────────────────
const CreateTimetableModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [classes, setClasses] = useState([emptyClass()]);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1 = name, 2 = classes

  const handleClassChange = (id, field, value) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  };

  const handleAddClass = () => {
    setClasses((prev) => [
      ...prev,
      { ...emptyClass(), colorIdx: prev.length % CLASS_COLORS.length },
    ]);
  };

  const handleRemoveClass = (id) => {
    if (classes.length === 1) return; // keep at least one
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleNext = () => {
    if (!name.trim()) {
      setError("Please enter a timetable name.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = () => {
    const validClasses = classes.filter((c) => c.subject.trim());
    if (validClasses.length === 0) {
      setError("Please add at least one class with a subject.");
      return;
    }

    // Check for time conflicts on the same day
    for (const day of DAYS) {
      const dayClasses = validClasses.filter((c) => c.day === day);
      for (let i = 0; i < dayClasses.length; i++) {
        for (let j = i + 1; j < dayClasses.length; j++) {
          const a = dayClasses[i];
          const b = dayClasses[j];
          if (a.startTime < b.endTime && b.startTime < a.endTime) {
            setError(
              `Time conflict on ${day}: "${a.subject}" and "${b.subject}" overlap.`,
            );
            return;
          }
        }
      }
    }

    setError(null);
    onCreated({
      id: generateId(),
      name: name.trim(),
      classes: validClasses,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal modal--large">
        <div className="modal-header">
          <h2>
            {step === 1 ? "Name Your Timetable" : `Add Classes — ${name}`}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? "step--active" : ""}`}>
            <span>1</span> Name
          </div>
          <div className="step-line" />
          <div className={`step ${step >= 2 ? "step--active" : ""}`}>
            <span>2</span> Classes
          </div>
        </div>

        {error && (
          <div className="modal-error">
            <X size={14} /> {error}
          </div>
        )}

        {/* ── Step 1: Name ── */}
        {step === 1 && (
          <div className="modal-body">
            <label>
              Timetable Name <span>*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Semester 2 Schedule"
              maxLength={80}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
            />
            <p className="field-hint">
              Give your timetable a name to identify it easily.
            </p>
          </div>
        )}

        {/* ── Step 2: Classes ── */}
        {step === 2 && (
          <div className="modal-body modal-body--scroll">
            {classes.map((cls, i) => (
              <ClassRow
                key={cls.id}
                cls={cls}
                index={i}
                onChange={handleClassChange}
                onRemove={handleRemoveClass}
              />
            ))}
            <button className="btn-add-class" onClick={handleAddClass}>
              <Plus size={16} /> Add Another Class
            </button>
          </div>
        )}

        <div className="modal-footer">
          {step === 1 ? (
            <>
              <button className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleNext}>
                Next — Add Classes
              </button>
            </>
          ) : (
            <>
              <button className="btn-cancel" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                Create Timetable
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Timetable Grid View ───────────────────────────────────────────
const TimetableGrid = ({ timetable, onDelete }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Get only days that have classes
  const activeDays = DAYS.filter((d) =>
    timetable.classes.some((c) => c.day === d),
  );

  // Get min and max times for the grid range
  const allStarts = timetable.classes.map((c) => c.startTime);
  const allEnds = timetable.classes.map((c) => c.endTime);
  const minTime = allStarts.length
    ? allStarts.reduce((a, b) => (a < b ? a : b))
    : "08:00";
  const maxTime = allEnds.length
    ? allEnds.reduce((a, b) => (a > b ? a : b))
    : "17:00";

  // Build visible time slots between min and max
  const visibleSlots = TIME_SLOTS.filter((t) => t >= minTime && t <= maxTime);

  return (
    <div className="timetable-card">
      {/* Card Header */}
      <div className="timetable-card-header">
        <div className="timetable-card-title">
          <h3>{timetable.name}</h3>
          <span className="timetable-meta">
            {timetable.classes.length} class
            {timetable.classes.length !== 1 ? "es" : ""}
          </span>
        </div>
        <div className="timetable-card-actions">
          <button
            className="btn-icon"
            onClick={() => setCollapsed((p) => !p)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
          <button
            className="btn-icon btn-icon--danger"
            onClick={() => onDelete(timetable.id)}
            title="Delete timetable"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Grid */}
      {!collapsed && (
        <div className="timetable-grid-wrapper">
          <div
            className="timetable-grid"
            style={{
              gridTemplateColumns: `80px repeat(${activeDays.length}, 1fr)`,
            }}
          >
            {/* Corner cell */}
            <div className="grid-corner">
              <Clock size={14} />
            </div>

            {/* Day headers */}
            {activeDays.map((day) => (
              <div key={day} className="grid-day-header">
                <span className="grid-day-full">{day}</span>
                <span className="grid-day-short">{day.slice(0, 3)}</span>
              </div>
            ))}

            {/* Time rows */}
            {visibleSlots.map((slot) => (
              <>
                {/* Time label */}
                <div key={`time-${slot}`} className="grid-time-label">
                  {formatTime(slot)}
                </div>

                {/* Cells per day */}
                {activeDays.map((day) => {
                  const classInSlot = timetable.classes.find(
                    (c) =>
                      c.day === day && c.startTime <= slot && c.endTime > slot,
                  );
                  const isStart = classInSlot?.startTime === slot;

                  return (
                    <div
                      key={`${day}-${slot}`}
                      className={`grid-cell ${classInSlot ? "grid-cell--occupied" : ""}`}
                    >
                      {classInSlot && isStart && (
                        <div
                          className="grid-class-block"
                          style={{
                            backgroundColor:
                              CLASS_COLORS[classInSlot.colorIdx]?.bg,
                            borderLeft: `3px solid ${CLASS_COLORS[classInSlot.colorIdx]?.border}`,
                            color: CLASS_COLORS[classInSlot.colorIdx]?.text,
                          }}
                        >
                          <p className="block-subject">{classInSlot.subject}</p>
                          {classInSlot.location && (
                            <p className="block-location">
                              {classInSlot.location}
                            </p>
                          )}
                          <p className="block-time">
                            {formatTime(classInSlot.startTime)} –{" "}
                            {formatTime(classInSlot.endTime)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleCreated = (newTimetable) => {
    setTimetables((prev) => [newTimetable, ...prev]);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this timetable?")) {
      setTimetables((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="timetable-page">
      {/* ── Page Header ── */}
      <div className="timetable-header">
        <div>
          <h1>Timetable</h1>
          <p>Manage and view your class schedules</p>
        </div>
        <button className="btn-create" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Timetable
        </button>
      </div>

      {/* ── Timetable List ── */}
      {timetables.length === 0 ? (
        <div className="timetable-empty">
          <Clock size={40} color="#d1d5db" />
          <p>No timetables yet.</p>
          <button className="btn-tcreate" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Create your first timetable
          </button>
        </div>
      ) : (
        <div className="timetable-list">
          {timetables.map((tt) => (
            <TimetableGrid key={tt.id} timetable={tt} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <CreateTimetableModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
};

export default Timetable;
