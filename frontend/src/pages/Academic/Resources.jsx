import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import "./Resources.css";

// ── Tag Colours ───────────────────────────────────────────────────
const tagColors = {
  Tutorial: { color: "#6d28d9", bg: "#ede9fe" },
  Article: { color: "#1d4ed8", bg: "#dbeafe" },
  Video: { color: "#b91c1c", bg: "#fee2e2" },
  Guide: { color: "#065f46", bg: "#d1fae5" },
  Docs: { color: "#92400e", bg: "#fef3c7" },
  Tool: { color: "#374151", bg: "#f3f4f6" },
};

// ── Resource Item ─────────────────────────────────────────────────
const ResourceItem = ({ item }) => {
  const tag = tagColors[item.tag] || { color: "#374151", bg: "#f3f4f6" };

  return (
    <div className="resource-item">
      <div className="resource-info">
        <span className="resource-name">{item.title}</span>
        <span className="resource-desc">{item.description}</span>
        <span
          className="resource-tag"
          style={{ color: tag.color, backgroundColor: tag.bg }}
        >
          {item.tag}
        </span>
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="resource-external"
      >
        <ExternalLink size={18} />
      </a>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const Resources = () => {
  const { selectedProgram, selectedYear } = useOutletContext();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guard against undefined values on first render
    if (!selectedProgram || !selectedYear) return;

    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:5000/api/resources?department=${selectedProgram}&year=${selectedYear}`,
        );

        // Check response before attempting to parse JSON
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();

        // Group flat API response by course_code
        const grouped = data.reduce((acc, item) => {
          const key = item.course_code;
          if (!acc[key]) {
            acc[key] = {
              course: item.course_code,
              title: item.course_title,
              items: [],
            };
          }
          acc[key].items.push(item);
          return acc;
        }, {});

        setSections(Object.values(grouped));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [selectedProgram, selectedYear]);

  if (loading) return <p className="resources-empty">Loading resources...</p>;
  if (error) return <p className="resources-empty">{error}</p>;

  return (
    <div className="resources-page">
      {/* ── Page Header ── */}
      <div className="resources-header">
        <h1>Educational Resources</h1>
        <p>
          {selectedProgram} — Year {selectedYear} curated learning materials
        </p>
      </div>

      {/* ── Resource Sections ── */}
      {sections.length === 0 ? (
        <p className="resources-empty">
          No resources available for this selection.
        </p>
      ) : (
        <div className="resources-list">
          {sections.map((section) => (
            <div key={section.course} className="resource-card">
              {/* Course Heading */}
              <div className="resource-card-header">
                <span className="course-code">{section.course}</span>
                <span className="course-title">{section.title}</span>
              </div>

              {/* Resource Items */}
              <div className="resource-card-body">
                {section.items.map((item) => (
                  <ResourceItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
