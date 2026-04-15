import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Users, Calendar, MessageCircle, UserPlus, X } from "lucide-react";
import "./StudyGroups.css";

const API = import.meta.env.VITE_API_URL;

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
    if (!form.name || !form.course_code || !form.course_title) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          max_members: Number(form.max_members),
          year: selectedYear,
          department_id: 1, // replace with real dept id from auth later
        }),
      });
      if (!res.ok) throw new Error("Failed to create group");
      const data = await res.json();
      onCreated(data);
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
          <h2>Create Study Group</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-body">
          <label>
            Group Name <span>*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Algorithms Study Circle"
          />

          <label>
            Course Code <span>*</span>
          </label>
          <input
            name="course_code"
            value={form.course_code}
            onChange={handleChange}
            placeholder="e.g. CS201"
          />

          <label>
            Course Title <span>*</span>
          </label>
          <input
            name="course_title"
            value={form.course_title}
            onChange={handleChange}
            placeholder="e.g. Data Structures & Algorithms"
          />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What will this group focus on?"
            rows={3}
          />

          <label>Maximum Members</label>
          <input
            type="number"
            name="max_members"
            value={form.max_members}
            onChange={handleChange}
            min={2}
            max={30}
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
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Group Card ────────────────────────────────────────────────────
const GroupCard = ({ group, onJoin }) => {
  const navigate = useNavigate();
  const isFull = group.member_count >= group.max_members;

  return (
    <div className="group-card">
      <div className="group-card-header">
        <h3 className="group-name">{group.name}</h3>
        <div className="group-members">
          <Users size={15} />
          <span>
            {group.member_count}/{group.max_members}
          </span>
        </div>
      </div>

      <p className="group-course">
        {group.course_code} - {group.course_title}
      </p>
      <p className="group-desc">{group.description}</p>

      <div className="group-actions">
        <button
          className="btn-join"
          disabled={isFull}
          onClick={() => onJoin(group.id)}
        >
          {isFull ? "Group Full" : "Join Group"}
        </button>
        <button
          className="btn-details"
          onClick={() => navigate(`/study-groups/${group.id}`)}
        >
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!selectedProgram || !selectedYear) return;
    const fetchGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API}/api/groups?department=${selectedProgram}&year=${selectedYear}`,
        );
        if (!res.ok) throw new Error("Failed to fetch groups");
        const data = await res.json();
        setGroups(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [selectedProgram, selectedYear]);

  const handleJoin = async (groupId) => {
    try {
      const res = await fetch(`${API}/api/groups/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: 1 }), // replace with real student id from auth
      });
      if (!res.ok) throw new Error("Could not join group");
      // refresh member count
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, member_count: Number(g.member_count) + 1 }
            : g,
        ),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreated = (newGroup) => {
    setGroups((prev) => [{ ...newGroup, member_count: 0 }, ...prev]);
  };

  if (loading) return <p className="groups-empty">Loading groups...</p>;
  if (error) return <p className="groups-empty">{error}</p>;

  return (
    <div className="study-groups-page">
      <div className="study-groups-header">
        <div>
          <h1>Study Groups</h1>
          <p>Join or create study groups with your classmates</p>
        </div>
        <button className="btn-create" onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="groups-empty">
          No study groups available for this selection.
        </p>
      ) : (
        <div className="groups-grid">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} onJoin={handleJoin} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
          selectedProgram={selectedProgram}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
};

export default StudyGroups;
