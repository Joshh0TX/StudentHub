import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  X,
  Clock,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "./Timetable.css";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

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

  // Only show days that have at least one class
  const activeDays = DAYS.filter((d) =>
    timetable.classes.some((c) => c.day === d),
  );

  // Find the earliest start and latest end across all classes
  const allStarts = timetable.classes.map((c) => c.startTime);
  const allEnds = timetable.classes.map((c) => c.endTime);
  const minTime = allStarts.length
    ? allStarts.reduce((a, b) => (a < b ? a : b))
    : "08:00";
  const maxTime = allEnds.length
    ? allEnds.reduce((a, b) => (a > b ? a : b))
    : "17:00";

  // Build the visible 30-min slots between min and max
  const visibleSlots = TIME_SLOTS.filter((t) => t >= minTime && t <= maxTime);

  // ── Row index helpers ─────────────────────────────────────────
  // Each slot occupies one grid row (after the header row)
  // Header = row 1, first slot = row 2, second slot = row 3 ...
  const slotToRow = (time) => {
    const idx = visibleSlots.indexOf(time);
    return idx === -1 ? null : idx + 2; // +2 because row 1 is the header
  };

  // How many 30-min slots does a class span?
  const spanCount = (startTime, endTime) => {
    const startIdx = visibleSlots.indexOf(startTime);
    const endIdx = visibleSlots.indexOf(endTime);
    if (startIdx === -1) return 1;
    // If endTime is beyond visibleSlots (e.g. exactly maxTime), count to end
    const end = endIdx === -1 ? visibleSlots.length : endIdx;
    return Math.max(1, end - startIdx);
  };

  return (
    <div className="timetable-card">
      {/* ── Card Header ── */}
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

      {/* ── Grid ── */}
      {!collapsed && (
        <div className="timetable-grid-wrapper">
          <div
            className="timetable-grid"
            style={{
              // Column 1 = time labels, then one column per active day
              gridTemplateColumns: `80px repeat(${activeDays.length}, 1fr)`,
              // Row 1 = day headers, then one row per 30-min slot
              gridTemplateRows: `40px repeat(${visibleSlots.length}, 36px)`,
            }}
          >
            {/* ── Corner cell ── */}
            <div className="grid-corner" style={{ gridRow: 1, gridColumn: 1 }}>
              <Clock size={14} />
            </div>

            {/* ── Day headers (row 1) ── */}
            {activeDays.map((day, colIdx) => (
              <div
                key={day}
                className="grid-day-header"
                style={{ gridRow: 1, gridColumn: colIdx + 2 }}
              >
                <span className="grid-day-full">{day}</span>
                <span className="grid-day-short">{day.slice(0, 3)}</span>
              </div>
            ))}

            {/* ── Time labels (column 1, one per slot) ── */}
            {visibleSlots.map((slot, rowIdx) => (
              <div
                key={`time-${slot}`}
                className="grid-time-label"
                style={{ gridRow: rowIdx + 2, gridColumn: 1 }}
              >
                {/* Only show label on the hour */}
                {slot.endsWith(":00") ? formatTime(slot) : ""}
              </div>
            ))}

            {/* ── Background grid cells (empty slots) ── */}
            {visibleSlots.map((slot, rowIdx) =>
              activeDays.map((day, colIdx) => (
                <div
                  key={`bg-${day}-${slot}`}
                  className={`grid-cell ${slot.endsWith(":00") ? "grid-cell--hour" : ""}`}
                  style={{
                    gridRow: rowIdx + 2,
                    gridColumn: colIdx + 2,
                  }}
                />
              )),
            )}

            {/* ── Class blocks — span their full duration ── */}
            {timetable.classes.map((cls) => {
              const colIdx = activeDays.indexOf(cls.day);
              if (colIdx === -1) return null;

              const rowStart = slotToRow(cls.startTime);
              if (rowStart === null) return null;

              const span = spanCount(cls.startTime, cls.endTime);
              const colors = CLASS_COLORS[cls.colorIdx] || CLASS_COLORS[0];

              return (
                <div
                  key={cls.id}
                  className="grid-class-block"
                  style={{
                    gridRow: `${rowStart} / span ${span}`,
                    gridColumn: colIdx + 2,
                    backgroundColor: colors.bg,
                    borderLeft: `4px solid ${colors.border}`,
                    color: colors.text,
                  }}
                >
                  <p className="block-subject">{cls.subject}</p>
                  {cls.location && (
                    <p className="block-location">{cls.location}</p>
                  )}
                  <p className="block-time">
                    {formatTime(cls.startTime)} – {formatTime(cls.endTime)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component (Database Version) ────────────────────────────
const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // false by default — auth loads first
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth(); // pull authLoading

  // ── Fetch timetables ──────────────────────────────────────────
  const fetchTimetables = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/timetables?student_id=${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Guard against HTML responses
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(text.slice(0, 100) || `Server error ${res.status}`);
      }

      const data = await res.json();
      const normalised = data.map((tt) => ({
        ...tt,
        classes: (tt.classes || []).filter((c) => c.id !== null),
      }));
      setTimetables(normalised);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTimetables();
  }, [fetchTimetables]);

  // ── Post new timetable ────────────────────────────────────────
  const handleCreated = async (newTimetable) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API}/api/timetables`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: newTimetable.name,
          student_id: user.id,
          classes: newTimetable.classes,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        throw new Error("Failed to save timetable");
      }

      const saved = await res.json();
      setTimetables((prev) => [
        { ...saved, classes: saved.classes || [] },
        ...prev,
      ]);
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Delete timetable ──────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this timetable?")) return;
    try {
      const res = await fetch(`${API}/api/timetables/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete timetable");
      setTimetables((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Early returns in correct order ────────────────────────────

  // 1. Auth context still resolving
  if (authLoading)
    return (
      <div className="groups-loading">
        <RefreshCw size={20} className="spinner" />
        <p>Loading session...</p>
      </div>
    );

  // 2. No user logged in
  if (!user)
    return (
      <div className="groups-error">
        <AlertCircle size={20} />
        <p>You must be logged in to view timetables.</p>
      </div>
    );

  // 3. Fetching timetable data
  if (loading)
    return (
      <div className="groups-loading">
        <RefreshCw size={20} className="spinner" />
        <p>Loading timetables...</p>
      </div>
    );

  // 4. Fetch error
  if (error)
    return (
      <div className="groups-error">
        <AlertCircle size={20} />
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchTimetables}>
          Retry
        </button>
      </div>
    );

  return (
    <div className="timetable-page">
      <div className="timetable-header">
        <div>
          <h1>Timetable</h1>
          <p>Manage and view your class schedules</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn-icon"
            onClick={fetchTimetables}
            title="Refresh"
            style={{ width: "auto", padding: "0 14px" }}
          >
            <RefreshCw size={16} />
          </button>
          <button className="btn-create" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add Timetable
          </button>
        </div>
      </div>

      {timetables.length === 0 ? (
        <div className="timetable-empty">
          <Clock size={40} color="#d1d5db" />
          <p>No timetables yet.</p>
          <button className="btn-create" onClick={() => setShowModal(true)}>
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
