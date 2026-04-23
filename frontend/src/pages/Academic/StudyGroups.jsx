import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Users, UserPlus, X, RefreshCw, AlertCircle } from "lucide-react";
import "./StudyGroups.css";

const API = import.meta.env.VITE_API_URL;

// ── Reusable fetch helper ─────────────────────────────────────────
// Handles JSON parsing, error checking and throws clean error messages
const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
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

// ── Create Group Modal ────────────────────────────────────────────
const CreateGroupModal = ({
  onClose,
  onCreated,
  selectedProgram,
  selectedYear,
}) => {
  const [form, setForm] = useState({
    name: "",
    course_code: "",
    course_title: "",
    description: "",
    max_members: 8,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !form.name.trim() ||
      !form.course_code.trim() ||
      !form.course_title.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const maxMembers = Number(form.max_members);
    if (isNaN(maxMembers) || maxMembers < 2 || maxMembers > 30) {
      setError("Maximum members must be between 2 and 30.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch("/api/groups", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          course_code: form.course_code.trim().toUpperCase(),
          course_title: form.course_title.trim(),
          description: form.description.trim(),
          max_members: maxMembers,
          year: Number(selectedYear),
          department: selectedProgram, //change when auth is complete
        }),
      });
      onCreated(data);
      onClose();
    } catch (err) {
      setError(err.message);
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
          <h2>Create Study Group</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="modal-error">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div className="modal-Gbody">
          <label>
            Group Name <span>*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Algorithms Study Circle"
            maxLength={100}
          />

          <label>
            Course Code <span>*</span>
          </label>
          <input
            name="course_code"
            value={form.course_code}
            onChange={handleChange}
            placeholder="e.g. CS201"
            maxLength={20}
          />

          <label>
            Course Title <span>*</span>
          </label>
          <input
            name="course_title"
            value={form.course_title}
            onChange={handleChange}
            placeholder="e.g. Data Structures & Algorithms"
            maxLength={150}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What will this group focus on?"
            rows={3}
            maxLength={500}
          />
          <span className="char-count">{form.description.length}/500</span>

          <label>Maximum Members</label>
          <input
            type="number"
            name="max_members"
            value={form.max_members}
            onChange={handleChange}
            min={2}
            max={30}
          />

          {/* Read only info so user can confirm context */}
          <div className="modal-context">
            <span>
              Department: <strong>{selectedProgram}</strong>
            </span>
            <span>
              Year: <strong>{selectedYear}</strong>
            </span>
          </div>
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
                <RefreshCw size={14} className="spinner" /> Creating...
              </>
            ) : (
              "Create Group"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const GroupCard = ({ group, onJoin, isMember, isJoining }) => {
  const navigate = useNavigate();
  const memberCount = isNaN(Number(group.member_count))
    ? 0
    : Number(group.member_count ?? 0);
  const isFull = memberCount >= group.max_members;

  // Guard — if group.id is missing, button does nothing
  const handleViewDetails = () => {
    if (!group.id) return console.error("Group ID is missing:", group);
    navigate(`${group.id}`);
  };

  return (
    <div className={`group-card ${isMember ? "group-card--member" : ""}`}>
      <div className="group-card-header">
        <h3 className="group-name">{group.name}</h3>
        <div className={`group-members ${isFull ? "group-members--full" : ""}`}>
          <Users size={15} />
          <span>
            {memberCount}/{group.max_members}
          </span>
        </div>
      </div>

      <p className="group-course">
        {[group.course_code, group.course_title].filter(Boolean).join(" - ")}
      </p>

      <p className="group-desc">
        {group.description || "No description provided."}
      </p>

      {isMember && <span className="member-badge">✓ You are a member</span>}
      {isFull && !isMember && <span className="full-badge">Group Full</span>}

      <div className="group-actions">
        <button
          className="btn-join"
          disabled={isFull || isMember || isJoining}
          onClick={() => onJoin(group.id)}
        >
          {isJoining
            ? "Joining..."
            : isMember
              ? "Joined"
              : isFull
                ? "Full"
                : "Join Group"}
        </button>
        <button className="btn-details" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const StudyGroups = () => {
  const { selectedProgram, selectedYear } = useOutletContext();

  const [groups, setGroups] = useState([]);
  const [myGroupIds, setMyGroupIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [joiningId, setJoiningId] = useState(null); // tracks which group is being joined
  const [departmentId, setDepartmentId] = useState(null);

  // ── Fetch department ID from program name ─────────────────────
  // Needed so the POST body can send a valid department_id foreign key
  const fetchDepartmentId = useCallback(async (program) => {
    try {
      const data = await apiFetch(
        `/api/departments?name=${encodeURIComponent(program)}`,
      );
      // API returns array — take the first match
      if (data.length > 0) setDepartmentId(data[0].id);
    } catch (err) {
      console.error("Could not fetch department ID:", err.message);
    }
  }, []);

  // ── Fetch all groups + student's joined groups ────────────────
  const fetchGroups = useCallback(async () => {
    if (!selectedProgram || !selectedYear) return;
    setLoading(true);
    setError(null);

    try {
      const [allData, myData] = await Promise.all([
        apiFetch(
          `/api/groups?department=${encodeURIComponent(selectedProgram)}&year=${selectedYear}`,
        ),
        apiFetch(`/api/groups/my-groups?student_id=test-user-123`),
      ]);

      // ✅ Ensure arrays always
      const safeGroups = Array.isArray(allData) ? allData : [];
      const safeMyGroups = Array.isArray(myData) ? myData : [];

      setGroups(safeGroups);
      setMyGroupIds(new Set(safeMyGroups.map((g) => g.id)));
    } catch (err) {
      // ✅ If backend says "not found", treat as empty instead
      if (err.message.toLowerCase().includes("not found")) {
        setGroups([]);
        setMyGroupIds(new Set());
        setError(null); // prevent error UI
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedProgram, selectedYear]);

  // Re-fetch whenever program or year changes
  useEffect(() => {
    fetchGroups();
    fetchDepartmentId(selectedProgram);
  }, [fetchGroups, fetchDepartmentId, selectedProgram]);

  // ── Join a group ──────────────────────────────────────────────
  const handleJoin = async (groupId) => {
    setJoiningId(groupId);
    try {
      await apiFetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        body: JSON.stringify({ student_id: "test-user-123" }), // replace with real auth id
      });

      // Update locally without re-fetching entire list
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, member_count: Number(g.member_count) + 1 }
            : g,
        ),
      );
      setMyGroupIds((prev) => new Set([...prev, groupId]));
    } catch (err) {
      alert(err.message);
    } finally {
      setJoiningId(null);
    }
  };

  // ── Add new group to top of list after creation ───────────────
  const handleCreated = (newGroup) => {
    setGroups((prev) => [{ ...newGroup, member_count: 0 }, ...prev]);
  };

  // ── Filter groups based on selected tab ──────────────────────
  const visibleGroups =
    filter === "mine" ? groups.filter((g) => myGroupIds.has(g.id)) : groups;

  // ── Render ────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="groups-loading">
        <RefreshCw size={20} className="spinner" />
        <p>Loading groups...</p>
      </div>
    );

  if (error)
    return (
      <div className="groups-error">
        <AlertCircle size={20} />
        <p>{error}</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button className="btn-retry" onClick={fetchGroups}>
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="study-groups-page">
      {/* ── Page Header ── */}
      <div className="study-groups-header">
        <div>
          <h1>Study Groups</h1>
          <p>Join or create study groups with your classmates</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchGroups} title="Refresh">
            <RefreshCw size={16} />
          </button>
          <button className="btn-create" onClick={() => setShowModal(true)}>
            <UserPlus size={18} /> Create Group
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === "all" ? "filter-btn--active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Groups
          <span className="filter-count">{groups.length}</span>
        </button>
        <button
          className={`filter-btn ${filter === "mine" ? "filter-btn--active" : ""}`}
          onClick={() => setFilter("mine")}
        >
          My Groups
          <span className="filter-count">{myGroupIds.size}</span>
        </button>
      </div>

      {/* ── Group Cards ── */}
      {visibleGroups.length === 0 ? (
        <div className="groups-empty">
          <p>
            {filter === "mine"
              ? "You have not joined any groups yet."
              : "No study groups available for this selection."}
          </p>
        </div>
      ) : (
        <div className="groups-grid">
          {visibleGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onJoin={handleJoin}
              isMember={myGroupIds.has(group.id)}
              isJoining={joiningId === group.id}
            />
          ))}
        </div>
      )}

      {/* ── Create Group Modal ── */}
      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
          selectedProgram={selectedProgram}
          selectedYear={selectedYear}
          departmentId={departmentId}
        />
      )}
    </div>
  );
};

export default StudyGroups;
