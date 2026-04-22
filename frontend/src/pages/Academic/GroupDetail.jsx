import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  MapPin,
  Video,
  ArrowLeft,
  Plus,
  X,
  Clock,
} from "lucide-react";
import "./GroupDetail.css";

const API = import.meta.env.VITE_API_URL;

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
    if (!form.title || !form.date_time) {
      setError("Title and date are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/groups/${groupId}/schedules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add schedule");
      const data = await res.json();
      onAdded(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add Meeting Schedule</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-body">
          <label>
            Session Title <span>*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Week 3 Problem Session"
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
              <label>Meeting URL</label>
              <input
                name="meeting_url"
                value={form.meeting_url}
                onChange={handleChange}
                placeholder="e.g. https://zoom.us/j/..."
              />
            </>
          ) : (
            <>
              <label>Location</label>
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
          />
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Schedule Card ─────────────────────────────────────────────────
const ScheduleCard = ({ schedule }) => {
  const date = new Date(schedule.date_time);

  return (
    <div className="schedule-card">
      <div className="schedule-date">
        <span className="schedule-day">
          {date.toLocaleDateString("en-US", { weekday: "short" })}
        </span>
        <span className="schedule-num">{date.getDate()}</span>
        <span className="schedule-month">
          {date.toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>

      <div className="schedule-info">
        <p className="schedule-title">{schedule.title}</p>
        <div className="schedule-meta">
          <Clock size={13} />
          <span>
            {date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="schedule-meta">
          {schedule.is_online ? (
            <>
              <Video size={13} />
              <a
                href={schedule.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="schedule-link"
              >
                Join Online
              </a>
            </>
          ) : (
            <>
              <MapPin size={13} />
              <span>{schedule.location}</span>
            </>
          )}
        </div>
        {schedule.notes && <p className="schedule-notes">{schedule.notes}</p>}
      </div>

      <span
        className={`schedule-badge ${schedule.is_online ? "badge-online" : "badge-physical"}`}
      >
        {schedule.is_online ? "Online" : "In Person"}
      </span>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/groups/${id}`);
        if (!res.ok) throw new Error("Group not found");
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  const handleScheduleAdded = (newSchedule) => {
    setGroup((prev) => ({
      ...prev,
      schedules: [...(prev.schedules || []), newSchedule],
    }));
  };

  if (loading) return <p className="detail-empty">Loading group...</p>;
  if (error) return <p className="detail-empty">{error}</p>;

  const isFull = group.member_count >= group.max_members;

  return (
    <div className="group-detail-page">
      {/* Back button */}
      <button className="btn-back" onClick={() => navigate("/study-groups")}>
        <ArrowLeft size={16} /> Back to Study Groups
      </button>

      {/* Group Header */}
      <div className="detail-header">
        <div className="detail-header-text">
          <h1>{group.name}</h1>
          <p className="detail-course">
            {group.course_code} - {group.course_title}
          </p>
          <p className="detail-dept">
            {group.department_name} — Year {group.year}
          </p>
        </div>
        <div className="detail-header-actions">
          <div className="detail-members">
            <Users size={16} />
            <span>
              {group.member_count}/{group.max_members} members
            </span>
          </div>
          <button className="btn-join-detail" disabled={isFull}>
            {isFull ? "Group Full" : "Join Group"}
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="detail-section">
        <h2>About this Group</h2>
        <p className="detail-description">
          {group.description || "No description provided."}
        </p>
      </div>

      {/* Schedules */}
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

        {!group.schedules || group.schedules.length === 0 ? (
          <p className="detail-empty">No sessions scheduled yet.</p>
        ) : (
          <div className="schedules-list">
            {group.schedules.map((s) => (
              <ScheduleCard key={s.id} schedule={s} />
            ))}
          </div>
        )}
      </div>

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
