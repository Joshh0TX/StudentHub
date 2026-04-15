import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const Resources = () => {
  const { selectedProgram, selectedYear } = useOutletContext();

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:5000/api/resources?department=${selectedProgram}&year=${selectedYear}`,
        );
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
        setError("Failed to load resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [selectedProgram, selectedYear]); // re-fetches when program or year changes

  if (loading) return <p className="resources-empty">Loading resources...</p>;
  if (error) return <p className="resources-empty">{error}</p>;

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Educational Resources</h1>
        <p>
          {selectedProgram} — Year {selectedYear} curated learning materials
        </p>
      </div>

      {sections.length === 0 ? (
        <p className="resources-empty">
          No resources available for this selection.
        </p>
      ) : (
        <div className="resources-list">
          {sections.map((section) => (
            <div key={section.course} className="resource-card">
              <div className="resource-card-header">
                <span className="course-code">{section.course}</span>
                <span className="course-title">{section.title}</span>
              </div>
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
