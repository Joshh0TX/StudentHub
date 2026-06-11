import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  X,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  Pencil,
} from "lucide-react";
import "./Timetable.css";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";
import { useOutletContext } from "react-router-dom";

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

const normaliseTime = (val) => {
  if (!val) return "09:00";
  if (/^\d{2}:\d{2}$/.test(val)) return val;
  const date = new Date(val);
  if (!isNaN(date.getTime())) {
    return date.toISOString().slice(11, 16);
  }
  return "09:00";
};

const formatDuration = (startTime, endTime) => {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const totalMins = eh * 60 + em - (sh * 60 + sm);
  if (totalMins <= 0) return "";
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
};

const initials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

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

// ── Create / Edit Timetable Modal ─────────────────────────────────
const CreateTimetableModal = ({ onClose, onCreated, initialData }) => {
  // Seed state from initialData if provided (edit mode), else blank (create mode)
  const [name, setName] = useState(initialData?.name ?? "");
  const [classes, setClasses] = useState(
    initialData?.classes?.length
      ? initialData.classes.map((c) => ({ ...c, id: c.id ?? generateId() }))
      : [emptyClass()],
  );
  const [error, setError] = useState(null);
  // Start on step 2 directly if editing (name already known)
  const [step, setStep] = useState(initialData ? 2 : 1);

  const handleClassChange = (id, field, value) =>
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const updated = { ...c, [field]: value };

        if (field === "startTime") {
          const firstValidEnd = TIME_SLOTS.find((t) => t > value);
          updated.endTime = firstValidEnd ?? value;
        }

        return updated;
      }),
    );

  const handleAddClass = () =>
    setClasses((prev) => [
      ...prev,
      { ...emptyClass(), colorIdx: prev.length % CLASS_COLORS.length },
    ]);

  const handleRemoveClass = (id) => {
    if (classes.length === 1) return;
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
    for (const day of DAYS) {
      const dayClasses = validClasses.filter((c) => c.day === day);
      for (let i = 0; i < dayClasses.length; i++) {
        for (let j = i + 1; j < dayClasses.length; j++) {
          const a = dayClasses[i],
            b = dayClasses[j];
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
      id: initialData?.id ?? generateId(), // preserve ID in edit mode
      name: name.trim(),
      classes: validClasses,
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
      isEdit: !!initialData, // flag so the parent knows to PATCH not POST
    });
    onClose();
  };

  const isEditMode = !!initialData;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal modal--large">
        <div className="modal-header">
          <h2>
            {isEditMode
              ? `Edit Timetable — ${name}`
              : step === 1
                ? "Name Your Timetable"
                : `Add Classes — ${name}`}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Step indicator — only shown in create mode */}
        {!isEditMode && (
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? "step--active" : ""}`}>
              <span>1</span> Name
            </div>
            <div className="step-line" />
            <div className={`step ${step >= 2 ? "step--active" : ""}`}>
              <span>2</span> Classes
            </div>
          </div>
        )}

        {error && (
          <div className="modal-error">
            <X size={14} /> {error}
          </div>
        )}

        {step === 1 && !isEditMode && (
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

        {(step === 2 || isEditMode) && (
          <>
            {/* Name field shown inline at top when editing */}
            {isEditMode && (
              <div className="modal-body" style={{ paddingBottom: 0, gap: 6 }}>
                <label>
                  Timetable Name <span>*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Semester 2 Schedule"
                  maxLength={80}
                />
              </div>
            )}
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
          </>
        )}

        <div className="modal-footer">
          {isEditMode ? (
            <>
              <button className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                Save Changes
              </button>
            </>
          ) : step === 1 ? (
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

// ── Creator Badge ─────────────────────────────────────────────────
const CreatorBadge = ({ name, isOwner }) => {
  const label = isOwner ? "You" : name || "Unknown";
  const variant = isOwner ? "you" : "other";

  return (
    <span
      className={`timetable-creator-badge timetable-creator-badge--${variant}`}
    >
      <span className={`creator-avatar creator-avatar--${variant}`}>
        {initials(label)}
      </span>
      {isOwner ? "Created by you" : `Created by ${label}`}
    </span>
  );
};

// ── Timetable Grid View ───────────────────────────────────────────
const TimetableGrid = ({
  timetable,
  onDelete,
  onEdit,
  canModify,
  currentUserId,
}) => {
  const isOwner = String(timetable.createdBy) === String(currentUserId);
  const [collapsed, setCollapsed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const activeDays = DAYS.filter((d) =>
    timetable.classes.some((c) => c.day === d),
  );

  const allTimes = timetable.classes.flatMap((c) => [c.startTime, c.endTime]);
  const minTime = allTimes.length
    ? allTimes.reduce((a, b) => (a < b ? a : b))
    : "08:00";
  const maxTime = allTimes.length
    ? allTimes.reduce((a, b) => (a > b ? a : b))
    : "17:00";

  const visibleSlots = TIME_SLOTS.filter((t) => t >= minTime && t <= maxTime);

  const slotToRow = (time) => {
    const idx = visibleSlots.indexOf(time);
    return idx === -1 ? null : idx + 2;
  };
  const spanCount = (startTime, endTime) => {
    const startIdx = visibleSlots.indexOf(startTime);
    const endIdx = visibleSlots.indexOf(endTime);
    if (startIdx === -1) return 1;
    const end = endIdx === -1 ? visibleSlots.length : endIdx;
    return Math.max(1, end - startIdx);
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(timetable.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="timetable-card">
      {/* ── Card Header ── */}
      <div className="timetable-card-header">
        <div className="timetable-card-title">
          <h3>{timetable.name}</h3>

          <div className="timetable-meta-row">
            <span className="timetable-meta">
              <Clock size={11} />
              {timetable.classes.length} class
              {timetable.classes.length !== 1 ? "es" : ""}
            </span>

            <CreatorBadge
              name={
                timetable.creator
                  ? `${timetable.creator.f_name} ${timetable.creator.l_name}`
                  : null
              }
              isOwner={isOwner}
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="timetable-card-actions">
          {canModify && (
            <>
              {/* Edit button */}
              <button
                className="btn-edit"
                onClick={() => setShowEditModal(true)}
                title="Edit timetable"
              >
                <Pencil size={14} />
                <span>Edit</span>
              </button>

              {/* Delete button */}
              <button
                className="btn-delete"
                onClick={handleDeleteClick}
                title={
                  confirmDelete
                    ? "Click again to confirm deletion"
                    : "Delete timetable"
                }
                style={
                  confirmDelete
                    ? {
                      background: "#fee2e2",
                      borderColor: "#dc2626",
                      color: "#dc2626",
                    }
                    : {}
                }
              >
                <Trash2 size={14} />
                <span>{confirmDelete ? "Confirm delete?" : "Delete"}</span>
              </button>
            </>
          )}

          <button
            className="btn-collapse"
            onClick={() => setCollapsed((p) => !p)}
            title={collapsed ? "Expand" : "Collapse"}
            style={{ width: "auto", padding: "0 14px" }}
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      {!collapsed && (
        <div className="timetable-grid-wrapper">
          <div
            className="timetable-grid"
            style={{
              gridTemplateColumns: `80px repeat(${activeDays.length}, 1fr)`,
              gridTemplateRows: `40px repeat(${visibleSlots.length}, 36px)`,
            }}
          >
            {/* Corner */}
            <div className="grid-corner" style={{ gridRow: 1, gridColumn: 1 }}>
              <Clock size={14} />
            </div>

            {/* Day headers */}
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

            {/* Time labels */}
            {visibleSlots.map((slot, rowIdx) => (
              <div
                key={`time-${slot}`}
                className="grid-time-label"
                style={{ gridRow: rowIdx + 2, gridColumn: 1 }}
              >
                {slot.endsWith(":00") ? formatTime(slot) : ""}
              </div>
            ))}

            {/* Background cells */}
            {visibleSlots.map((slot, rowIdx) =>
              activeDays.map((day, colIdx) => (
                <div
                  key={`bg-${day}-${slot}`}
                  className={`grid-cell ${slot.endsWith(":00") ? "grid-cell--hour" : ""}`}
                  style={{ gridRow: rowIdx + 2, gridColumn: colIdx + 2 }}
                />
              )),
            )}

            {/* Class blocks */}
            {timetable.classes.map((cls) => {
              const colIdx = activeDays.indexOf(cls.day);
              if (colIdx === -1) return null;
              const rowStart = slotToRow(cls.startTime);
              if (rowStart === null) return null;
              const span = spanCount(cls.startTime, cls.endTime);
              const colors = CLASS_COLORS[cls.colorIdx] || CLASS_COLORS[0];
              const isCompact = span === 1;
              const isTopRow = rowStart === 2; // +++ first data row in the grid
              const duration = formatDuration(cls.startTime, cls.endTime);

              return (
                <div
                  key={cls.id}
                  className={[
                    "grid-class-block",
                    isCompact ? "grid-class-block--compact" : "",
                    isTopRow ? "grid-class-block--top-row" : "", // +++ flip tooltip
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    gridRow: `${rowStart} / span ${span}`,
                    gridColumn: colIdx + 2,
                    backgroundColor: colors.bg,
                    borderLeft: `4px solid ${colors.border}`,
                    borderTop: `2px solid ${colors.border}`,
                    color: colors.text,
                  }}
                >
                  <p className="block-subject">{cls.subject}</p>

                  {!isCompact && (
                    <>
                      {cls.location && (
                        <p className="block-location">
                          <span className="block-location-dot">📍</span>
                          {cls.location}
                        </p>
                      )}
                      <p className="block-time-range">
                        {formatTime(cls.startTime)} – {formatTime(cls.endTime)}
                        {duration && (
                          <span className="block-duration"> · {duration}</span>
                        )}
                      </p>
                    </>
                  )}

                  {isCompact && (
                    <div className="block-tooltip">
                      <strong>{cls.subject}</strong>
                      {cls.location && (
                        <span className="block-tooltip-location">
                          📍 {cls.location}
                        </span>
                      )}
                      <span className="block-tooltip-time">
                        {formatTime(cls.startTime)} – {formatTime(cls.endTime)}
                      </span>
                      {duration && (
                        <span className="block-tooltip-duration">
                          {duration}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit modal — only mounts when open */}
      {showEditModal && (
        <CreateTimetableModal
          initialData={timetable}
          onClose={() => setShowEditModal(false)}
          onCreated={(updated) => {
            onEdit(updated);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, loading: authLoading, getToken } = useAuth();
  const { selectedProgram, selectedYear } = useOutletContext();
  const { canCreateIn, canModifyIn } = usePermissions();
  const userCanCreate = canCreateIn(selectedProgram, selectedYear);

  // ── Fetch timetables ──────────────────────────────────────────
  const fetchTimetables = useCallback(async () => {
    if (!user?.id || !selectedProgram || !selectedYear) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API}/api/timetables?department=${encodeURIComponent(selectedProgram)}&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(text.slice(0, 100) || `Server error ${res.status}`);
      }
      const data = await res.json();
      const normalised = data.map((tt) => ({
        ...tt,
        classes: (tt.classes || [])
          .filter((c) => c.id !== null)
          .map((c) => ({
            ...c,
            startTime: normaliseTime(c.startTime ?? c.start_time),
            endTime: normaliseTime(c.endTime ?? c.end_time),
          })),
      }));
      setTimetables(normalised);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedProgram, selectedYear, getToken]);

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
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: newTimetable.name,
          department: selectedProgram,
          year: selectedYear,
          createdBy: user.id,
          classes: newTimetable.classes,
        }),
      });
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json"))
        throw new Error("Failed to save timetable");
      const saved = await res.json();
      setTimetables((prev) => [
        {
          ...saved,
          classes: (saved.classes || []).map((c) => ({
            ...c,
            startTime: normaliseTime(c.startTime ?? c.start_time),
            endTime: normaliseTime(c.endTime ?? c.end_time),
          })),
        },
        ...prev,
      ]);
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Edit timetable ────────────────────────────────────────────
  const handleEdit = async (updatedTimetable) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API}/api/timetables/${updatedTimetable.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: updatedTimetable.name,
          department: selectedProgram,
          year: selectedYear,
          createdBy: user.id,
          classes: updatedTimetable.classes,
        }),
      });
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json"))
        throw new Error("Failed to update timetable");
      const saved = await res.json();
      // Replace old timetable in state with updated version
      setTimetables((prev) =>
        prev.map((t) =>
          t.id === saved.id
            ? {
              ...saved,
              classes: (saved.classes || []).map((c) => ({
                ...c,
                startTime: normaliseTime(c.startTime ?? c.start_time),
                endTime: normaliseTime(c.endTime ?? c.end_time),
              })),
            }
            : t,
        ),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Delete timetable ──────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/api/timetables/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ student_id: user.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete timetable");
      }
      setTimetables((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Guards ────────────────────────────────────────────────────
  if (authLoading)
    return (
      <div className="groups-loading">
        <RefreshCw size={20} className="spinner" />
        <p>Loading session...</p>
      </div>
    );

  if (!user)
    return (
      <div className="groups-error">
        <AlertCircle size={20} />
        <p>You must be logged in to view timetables.</p>
      </div>
    );

  if (loading)
    return (
      <div className="groups-loading">
        <RefreshCw size={20} className="spinner" />
        <p>Loading timetables...</p>
      </div>
    );

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
          {userCanCreate && (
            <button className="btn-create" onClick={() => setShowModal(true)}>
              <Plus size={18} /> Add Timetable
            </button>
          )}
        </div>
      </div>

      {timetables.length === 0 ? (
        <div className="timetable-empty">
          <div style={{ display:'flex', flexDirection:'column', gap:'10px'}}>
            <Clock size={40} color="#d1d5db" />
            <p>No timetables yet.</p>
          </div>
          <button className="btn-create" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Create your first timetable
          </button>
        </div>
      ) : (
        <div className="timetable-list">
          {timetables.map((tt) => (
            <TimetableGrid
              key={tt.id}
              timetable={tt}
              onDelete={handleDelete}
              onEdit={handleEdit}
              currentUserId={user.id}
              selectedProgram={selectedProgram} // add
              selectedYear={selectedYear} // add
              canModify={canModifyIn(
                tt.createdBy ?? tt.created_by, // fix snake_case fallback
                tt.department, // or selectedProgram if not on the object
                tt.year, // or selectedYear
              )}
            />
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
