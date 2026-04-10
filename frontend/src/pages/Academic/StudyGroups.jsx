import { useOutletContext } from "react-router-dom";
import { Users, Calendar, MessageCircle, UserPlus } from "lucide-react";
import "./StudyGroups.css";

const allGroups = {
  "Computer Science": {
    1: [
      {
        id: 1,
        name: "Python Beginners Circle",
        course: "CS101 - Intro to Programming",
        description:
          "Weekly sessions covering Python basics and beginner coding exercises",
        members: 5,
        maxMembers: 8,
        nextSession: "Apr 10, 2026 at 2:00 PM",
        location: "Library Room 101",
      },
      {
        id: 2,
        name: "Discrete Math Study Group",
        course: "CS102 - Discrete Mathematics",
        description: "Problem-solving sessions on logic, sets and graph theory",
        members: 4,
        maxMembers: 6,
        nextSession: "Apr 11, 2026 at 4:00 PM",
        location: "Online - Zoom",
      },
    ],
    2: [
      {
        id: 3,
        name: "Algorithms Study Circle",
        course: "CS201 - Data Structures & Algorithms",
        description:
          "Weekly sessions focusing on problem-solving and coding challenges",
        members: 6,
        maxMembers: 8,
        nextSession: "Apr 4, 2026 at 3:00 PM",
        location: "Library Room 204",
      },
      {
        id: 4,
        name: "Database Project Team",
        course: "CS202 - Database Systems",
        description: "Working on the final database design project together",
        members: 4,
        maxMembers: 6,
        nextSession: "Apr 3, 2026 at 6:00 PM",
        location: "Student Center Room 12",
      },
      {
        id: 5,
        name: "React Developers Club",
        course: "CS202 - Object Oriented Programming",
        description:
          "Building projects together using React and modern JavaScript",
        members: 7,
        maxMembers: 10,
        nextSession: "Apr 5, 2026 at 5:00 PM",
        location: "Tech Lab B",
      },
    ],
    3: [
      {
        id: 6,
        name: "AI Research Group",
        course: "CS301 - Artificial Intelligence",
        description:
          "Exploring AI papers and implementing machine learning models",
        members: 5,
        maxMembers: 8,
        nextSession: "Apr 6, 2026 at 3:00 PM",
        location: "Innovation Hub Room 3",
      },
      {
        id: 7,
        name: "Software Engineering Team",
        course: "CS302 - Software Engineering",
        description:
          "Collaborative project planning and agile methodology practice",
        members: 6,
        maxMembers: 8,
        nextSession: "Apr 8, 2026 at 1:00 PM",
        location: "Library Room 305",
      },
    ],
  },
  Mathematics: {
    1: [
      {
        id: 8,
        name: "Calculus Study Group",
        course: "MA101 - Calculus I",
        description:
          "Working through problem sets and past exam questions together",
        members: 5,
        maxMembers: 8,
        nextSession: "Apr 7, 2026 at 10:00 AM",
        location: "Math Block Room 2",
      },
      {
        id: 9,
        name: "Linear Algebra Circle",
        course: "MA102 - Linear Algebra",
        description:
          "Visualising vectors and matrices through collaborative problem solving",
        members: 3,
        maxMembers: 6,
        nextSession: "Apr 9, 2026 at 2:00 PM",
        location: "Online - Google Meet",
      },
    ],
    2: [
      {
        id: 10,
        name: "Calculus II Group",
        course: "MA201 - Calculus II",
        description:
          "Tackling integration techniques and series convergence together",
        members: 4,
        maxMembers: 6,
        nextSession: "Apr 10, 2026 at 3:00 PM",
        location: "Math Block Room 5",
      },
    ],
    3: [
      {
        id: 11,
        name: "Analysis Study Circle",
        course: "MA301 - Real Analysis",
        description: "Working through proofs and real analysis problem sets",
        members: 4,
        maxMembers: 6,
        nextSession: "Apr 11, 2026 at 11:00 AM",
        location: "Library Room 202",
      },
    ],
  },
  Physics: {
    1: [
      {
        id: 12,
        name: "Mechanics Study Group",
        course: "PH101 - Mechanics",
        description:
          "Solving mechanics problems and reviewing lecture content weekly",
        members: 6,
        maxMembers: 8,
        nextSession: "Apr 4, 2026 at 4:00 PM",
        location: "Science Block Room 7",
      },
    ],
    2: [
      {
        id: 13,
        name: "Electromagnetism Group",
        course: "PH201 - Electromagnetism",
        description:
          "Working through Griffiths problems and lab report preparation",
        members: 5,
        maxMembers: 8,
        nextSession: "Apr 5, 2026 at 2:00 PM",
        location: "Physics Lab 3",
      },
    ],
    3: [
      {
        id: 14,
        name: "Quantum Study Circle",
        course: "PH301 - Quantum Mechanics",
        description:
          "Discussing quantum theory and working through problem sets",
        members: 4,
        maxMembers: 6,
        nextSession: "Apr 7, 2026 at 3:00 PM",
        location: "Science Block Room 12",
      },
    ],
  },
};

const GroupCard = ({ group }) => {
  const isFull = group.members >= group.maxMembers;

  return (
    <div className="group-card">
      {/* Card Header */}
      <div className="group-card-header">
        <h3 className="group-name">{group.name}</h3>
        <div className="group-members">
          <Users size={15} />
          <span>
            {group.members}/{group.maxMembers}
          </span>
        </div>
      </div>

      {/* Course */}
      <p className="group-course">{group.course}</p>

      {/* Description */}
      <p className="group-desc">{group.description}</p>

      {/* Meta */}
      <div className="group-meta">
        <div className="group-meta-item">
          <Calendar size={15} />
          <span>Next session: {group.nextSession}</span>
        </div>
        <div className="group-meta-item">
          <MessageCircle size={15} />
          <span>{group.location}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="group-actions">
        <button className="btn-join" disabled={isFull}>
          {isFull ? "Group Full" : "Join Group"}
        </button>
        <button className="btn-details">View Details</button>
      </div>
    </div>
  );
};

const StudyGroups = () => {
  const { selectedProgram, selectedYear } = useOutletContext();

  const groups = allGroups[selectedProgram]?.[selectedYear] ?? [];

  return (
    <div className="study-groups-page">
      {/* Page Header */}
      <div className="study-groups-header">
        <div>
          <h1>Study Groups</h1>
          <p>Join or create study groups with your classmates</p>
        </div>
        <button className="btn-create">
          <UserPlus size={18} />
          Create Group
        </button>
      </div>

      {/* Cards Grid */}
      {groups.length === 0 ? (
        <p className="groups-empty">
          No study groups available for this selection.
        </p>
      ) : (
        <div className="groups-grid">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyGroups;
