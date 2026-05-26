import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  MapPin,
  Video,
  ArrowLeft,
  Plus,
  X,
  Clock,
  RefreshCw,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./GroupDetail.css";

const API = import.meta.env.VITE_API_URL;

// ── Reusable fetch helper ─────────────────────────────────────────
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You must be logged in to perform this action.");
  }

  const { headers: extraHeaders, ...restOptions } = options;

  const res = await fetch(`${API}${endpoint}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...extraHeaders,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    let message;
    try {
      const json = JSON.parse(text);
      message = json.error || json.message || "An error occurred";
    } catch {
      message = text.slice(0, 150) || `Server error ${res.status}`;
    }
    throw new Error(message);
  }
  return res.json();
};

// ── Normalise schedule field names ────────────────────────────────
const normaliseSchedule = (s) => ({
  id: s.id,
  title: s.title,
  notes: s.notes,
  date_time: s.date_time ?? s.dateTime,
  is_online: s.is_online ?? s.isOnline ?? false,
  location: s.location,
  meeting_url: s.meeting_url ?? s.meetingUrl,
  createdBy: s.createdBy,
});

// ── Add Schedule Modal ────────────────────────────────────────────
const AddScheduleModal = ({ groupId, onClose, onAdded }) => {
  const [form, setForm] = useState({
    title: "",
    date_time: "",
    is_online: false,
    location: "",
    meeting_url: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Session title is required.");
      return;
    }
    if (!form.date_time) {
      setError("Date and time are required.");
      return;
    }
    if (form.is_online && !form.meeting_url.trim()) {
      setError("Please provide a meeting URL for online sessions.");
      return;
    }
    if (!form.is_online && !form.location.trim()) {
      setError("Please provide a location for in-person sessions.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch(`/api/groups/${groupId}/schedules`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      onAdded(normaliseSchedule(data));
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>Add Meeting Schedule</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="modal-error">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div className="modal-body">
          <label>
            Session Title <span>*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Week 3 Problem Session"
            maxLength={150}
          />

          <label>
            Date & Time <span>*</span>
          </label>
          <input
            type="datetime-local"
            name="date_time"
            value={form.date_time}
            onChange={handleChange}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="is_online"
              checked={form.is_online}
              onChange={handleChange}
            />
            Online Meeting
          </label>

          {form.is_online ? (
            <>
              <label>
                Meeting URL <span>*</span>
              </label>
              <input
                name="meeting_url"
                value={form.meeting_url}
                onChange={handleChange}
                placeholder="e.g. https://zoom.us/j/..."
              />
            </>
          ) : (
            <>
              <label>
                Location <span>*</span>
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Library Room 204"
              />
            </>
          )}

          <label>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any additional notes for this session..."
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="spinner" /> Adding...
              </>
            ) : (
              "Add Schedule"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Schedule Card ─────────────────────────────────────────────────
const ScheduleCard = ({ schedule, onDelete, canDelete }) => {
  const s = normaliseSchedule(schedule);
  const date = new Date(s.date_time);
  const isValidDate = !isNaN(date.getTime());

  return (
    <div className="schedule-card">
      {/* Date block */}
      <div className="schedule-date">
        {isValidDate ? (
          <>
            <span className="schedule-day">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="schedule-num">{date.getDate()}</span>
            <span className="schedule-month">
              {date.toLocaleDateString("en-US", { month: "short" })}
            </span>
          </>
        ) : (
          <span className="schedule-day">TBD</span>
        )}
      </div>

      {/* Info block */}
      <div className="schedule-info">
        <p className="schedule-title">{s.title}</p>

        {isValidDate && (
          <div className="schedule-meta">
            <Clock size={13} />
            <span>
              {date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        <div className="schedule-meta">
          {s.is_online ? (
            <>
              <Video size={13} />
              {s.meeting_url ? (
                <a
                  href={s.meeting_url}
                  target="_blank"
                  rel="noreferrer"
                  className="schedule-link"
                >
                  Join Online
                </a>
              ) : (
                <span>Online (no link provided)</span>
              )}
            </>
          ) : (
            <>
              <MapPin size={13} />
              <span>{s.location || "Location TBD"}</span>
            </>
          )}
        </div>

        {s.notes && <p className="schedule-notes">{s.notes}</p>}
      </div>

      <span
        className={`schedule-badge ${s.is_online ? "badge-online" : "badge-physical"}`}
      >
        {s.is_online ? "Online" : "In Person"}
      </span>

      {/* ── Delete button — only visible to creator or admin ── */}
      {canDelete && (
        <button
          className="btn-delete-schedule"
          onClick={() => onDelete(s.id)}
          title="Delete session"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // ← same pattern as StudyGroups.jsx

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchGroup = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/groups/${id}`);

      const memberCount = Number(
        data.member_count ?? data._count?.members ?? 0,
      );
      const schedules = (data.schedules ?? []).map(normaliseSchedule);

      setGroup({ ...data, member_count: memberCount, schedules });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const handleScheduleAdded = (newSchedule) => {
    setGroup((prev) => ({
      ...prev,
      schedules: [...(prev.schedules || []), newSchedule],
    }));
  };

  // ── Delete schedule ───────────────────────────────────────────
  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await apiFetch(`/api/groups/${id}/schedules/${scheduleId}`, {
        method: "DELETE",
      });
      setGroup((prev) => ({
        ...prev,
        schedules: prev.schedules.filter((s) => s.id !== scheduleId),
      }));
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Permission helper — mirrors canModify in StudyGroups.jsx ──
  const canDeleteSchedule = (scheduleCreatedBy) => {
    if (!user) return false;
    return user.role === "admin" || user.id === scheduleCreatedBy;
  };

  // ── Loading ───────────────────────────────────────────────────
  if (loading)
    return (
      <div className="groups-loading">
        <RefreshCw size={20} className="spinner" />
        <p>Loading group...</p>
      </div>
    );

  // ── Error ─────────────────────────────────────────────────────
  if (error)
    return (
      <div className="groups-error">
        <AlertCircle size={20} />
        <p>{error}</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-retry" onClick={fetchGroup}>
            Retry
          </button>
          <button
            className="btn-cancel"
            onClick={() => navigate("/study-groups")}
          >
            Back to Groups
          </button>
        </div>
      </div>
    );

  if (!group) return <p className="detail-empty">Group not found.</p>;

  return (
    <div className="group-detail-page">
      {/* ── Back Button ── */}
      <button className="btn-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Study Groups
      </button>

      {/* ── Group Header ── */}
      <div className="detail-header">
        <div className="detail-header-text">
          <h1>{group.name}</h1>
          <p className="detail-course">
            {[
              group.course_code ?? group.courseCode,
              group.course_title ?? group.courseTitle,
            ]
              .filter(Boolean)
              .join(" - ")}
          </p>
        </div>
        <div className="detail-header-actions">
          <div className="detail-members">
            <Users size={16} />
            <span>
              {group.member_count}/{group.max_members ?? group.maxMembers}{" "}
              members
            </span>
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      <div className="detail-section">
        <h2>About this Group</h2>
        <p className="detail-description">
          {group.description || "No description provided."}
        </p>
      </div>

      {/* ── Schedules ── */}
      <div className="detail-section">
        <div className="detail-section-header">
          <h2>Meeting Schedule</h2>
          <button
            className="btn-add-schedule"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> Add Session
          </button>
        </div>

        {group.schedules.length === 0 ? (
          <p className="detail-empty">No sessions scheduled yet.</p>
        ) : (
          <div className="schedules-list">
            {group.schedules.map((s) => (
              <ScheduleCard
                key={s.id}
                schedule={s}
                onDelete={handleDeleteSchedule}
                canDelete={canDeleteSchedule(s.createdBy)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Add Schedule Modal ── */}
      {showModal && (
        <AddScheduleModal
          groupId={id}
          onClose={() => setShowModal(false)}
          onAdded={handleScheduleAdded}
        />
      )}
    </div>
  );
};

export default GroupDetail;
