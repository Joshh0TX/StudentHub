import { useOutletContext } from "react-router-dom";
import { Link, FileText, Video, BookOpen, ExternalLink } from "lucide-react";
import "./Resources.css";

const allResources = {
  "Computer Science": {
    1: [
      {
        course: "CS101",
        title: "Intro to Programming",
        items: [
          {
            id: 1,
            icon: Link,
            iconColor: "#7c3aed",
            iconBg: "#ede9fe",
            name: "Python.org",
            description: "Official Python documentation and tutorials",
            tag: "Docs",
            url: "https://python.org",
          },
          {
            id: 2,
            icon: Video,
            iconColor: "#dc2626",
            iconBg: "#fee2e2",
            name: "CS50 Harvard",
            description: "Free intro to computer science course",
            tag: "Video",
            url: "https://cs50.harvard.edu",
          },
        ],
      },
      {
        course: "CS102",
        title: "Discrete Mathematics",
        items: [
          {
            id: 3,
            icon: FileText,
            iconColor: "#2563eb",
            iconBg: "#dbeafe",
            name: "Discrete Math Notes",
            description: "Comprehensive notes on logic, sets and graphs",
            tag: "Article",
            url: "https://example.com",
          },
          {
            id: 4,
            icon: BookOpen,
            iconColor: "#059669",
            iconBg: "#d1fae5",
            name: "MIT OpenCourseWare",
            description: "Discrete mathematics lecture slides and problem sets",
            tag: "Guide",
            url: "https://ocw.mit.edu",
          },
        ],
      },
    ],
    2: [
      {
        course: "CS201",
        title: "Data Structures & Algorithms",
        items: [
          {
            id: 5,
            icon: Link,
            iconColor: "#7c3aed",
            iconBg: "#ede9fe",
            name: "LeetCode",
            description:
              "Platform for practicing coding problems and algorithms",
            tag: "Tutorial",
            url: "https://leetcode.com",
          },
          {
            id: 6,
            icon: FileText,
            iconColor: "#2563eb",
            iconBg: "#dbeafe",
            name: "Big O Notation",
            description:
              "Comprehensive guide to understanding algorithm complexity",
            tag: "Article",
            url: "https://example.com",
          },
          {
            id: 7,
            icon: Video,
            iconColor: "#dc2626",
            iconBg: "#fee2e2",
            name: "Sorting Visualized",
            description: "Visual explanation of common sorting algorithms",
            tag: "Video",
            url: "https://example.com",
          },
        ],
      },
      {
        course: "CS202",
        title: "Object Oriented Programming",
        items: [
          {
            id: 8,
            icon: BookOpen,
            iconColor: "#059669",
            iconBg: "#d1fae5",
            name: "Refactoring Guru",
            description:
              "In-depth explanations of design patterns with examples",
            tag: "Guide",
            url: "https://refactoring.guru",
          },
          {
            id: 9,
            icon: Video,
            iconColor: "#dc2626",
            iconBg: "#fee2e2",
            name: "OOP Crash Course",
            description: "Video series covering OOP fundamentals",
            tag: "Video",
            url: "https://example.com",
          },
        ],
      },
    ],
    3: [
      {
        course: "CS301",
        title: "Artificial Intelligence",
        items: [
          {
            id: 10,
            icon: Link,
            iconColor: "#7c3aed",
            iconBg: "#ede9fe",
            name: "fast.ai",
            description: "Practical deep learning for coders",
            tag: "Tutorial",
            url: "https://fast.ai",
          },
          {
            id: 11,
            icon: FileText,
            iconColor: "#2563eb",
            iconBg: "#dbeafe",
            name: "AI Alignment Forum",
            description: "Research articles on AI safety and alignment",
            tag: "Article",
            url: "https://alignmentforum.org",
          },
        ],
      },
      {
        course: "CS302",
        title: "Software Engineering",
        items: [
          {
            id: 12,
            icon: BookOpen,
            iconColor: "#059669",
            iconBg: "#d1fae5",
            name: "Clean Code Guide",
            description: "Best practices for writing maintainable software",
            tag: "Guide",
            url: "https://example.com",
          },
          {
            id: 13,
            icon: Link,
            iconColor: "#7c3aed",
            iconBg: "#ede9fe",
            name: "GitHub Docs",
            description: "Version control and collaboration with Git",
            tag: "Docs",
            url: "https://docs.github.com",
          },
        ],
      },
    ],
  },
  Mathematics: {
    1: [
      {
        course: "MA101",
        title: "Calculus I",
        items: [
          {
            id: 14,
            icon: Video,
            iconColor: "#dc2626",
            iconBg: "#fee2e2",
            name: "Khan Academy Calc",
            description: "Free calculus lessons from basics to integration",
            tag: "Video",
            url: "https://khanacademy.org",
          },
          {
            id: 15,
            icon: FileText,
            iconColor: "#2563eb",
            iconBg: "#dbeafe",
            name: "Paul's Math Notes",
            description: "Detailed calculus notes and worked examples",
            tag: "Article",
            url: "https://tutorial.math.lamar.edu",
          },
        ],
      },
      {
        course: "MA102",
        title: "Linear Algebra",
        items: [
          {
            id: 16,
            icon: Video,
            iconColor: "#dc2626",
            iconBg: "#fee2e2",
            name: "3Blue1Brown",
            description: "Visual intuition for linear algebra concepts",
            tag: "Video",
            url: "https://youtube.com",
          },
          {
            id: 17,
            icon: BookOpen,
            iconColor: "#059669",
            iconBg: "#d1fae5",
            name: "Linear Algebra Done Right",
            description: "Textbook resource for abstract linear algebra",
            tag: "Guide",
            url: "https://example.com",
          },
        ],
      },
    ],
    2: [
      {
        course: "MA201",
        title: "Calculus II",
        items: [
          {
            id: 18,
            icon: Link,
            iconColor: "#7c3aed",
            iconBg: "#ede9fe",
            name: "Wolfram Alpha",
            description: "Compute integrals and verify your working",
            tag: "Tool",
            url: "https://wolframalpha.com",
          },
          {
            id: 19,
            icon: Video,
            iconColor: "#dc2626",
            iconBg: "#fee2e2",
            name: "Professor Leonard",
            description: "Full Calculus II lecture series on YouTube",
            tag: "Video",
            url: "https://youtube.com",
          },
        ],
      },
      {
        course: "MA202",
        title: "Statistics",
        items: [
          {
            id: 20,
            icon: FileText,
            iconColor: "#2563eb",
            iconBg: "#dbeafe",
            name: "StatQuest",
            description:
              "Statistics and machine learning concepts explained clearly",
            tag: "Article",
            url: "https://example.com",
          },
        ],
      },
    ],
    3: [
      {
        course: "MA301",
        title: "Real Analysis",
        items: [
          {
            id: 21,
            icon: BookOpen,
            iconColor: "#059669",
            iconBg: "#d1fae5",
            name: "Analysis WebNotes",
            description: "Online textbook covering real analysis thoroughly",
            tag: "Guide",
            url: "https://example.com",
          },
        ],
      },
      {
        course: "MA302",
        title: "Abstract Algebra",
        items: [
          {
            id: 22,
            icon: FileText,
            iconColor: "#2563eb",
            iconBg: "#dbeafe",
            name: "Abstract Algebra Notes",
            description: "Lecture notes on groups, rings and fields",
            tag: "Article",
            url: "https://example.com",
          },
        ],
      },
    ],
  },
  "Physics with Electronics": {
    1: [
      {
        course: "PH101",
        title: "Mechanics",
        items: [
          {
            id: 23,
            icon: Video,
            iconColor: "#dc2626",
            iconBg: "#fee2e2",
            name: "MIT OpenCourseWare",
            description: "Free physics lectures from MIT professors",
            tag: "Video",
            url: "https://ocw.mit.edu",
          },
          {
            id: 24,
            icon: FileText,
            iconColor: "#2563eb",
            iconBg: "#dbeafe",
            name: "HyperPhysics",
            description: "Concept maps covering all areas of physics",
            tag: "Article",
            url: "http://hyperphysics.phy-astr.gsu.edu",
          },
        ],
      },
      {
        course: "PH102",
        title: "Waves & Optics",
        items: [
          {
            id: 25,
            icon: Video,
            iconColor: "#dc2626",
            iconBg: "#fee2e2",
            name: "Wave Phenomena",
            description: "Visualizations and lectures on wave behaviour",
            tag: "Video",
            url: "https://example.com",
          },
        ],
      },
    ],
    2: [
      {
        course: "PH201",
        title: "Electromagnetism",
        items: [
          {
            id: 26,
            icon: FileText,
            iconColor: "#2563eb",
            iconBg: "#dbeafe",
            name: "HyperPhysics EM",
            description: "Detailed notes on electric and magnetic fields",
            tag: "Article",
            url: "http://hyperphysics.phy-astr.gsu.edu",
          },
          {
            id: 27,
            icon: BookOpen,
            iconColor: "#059669",
            iconBg: "#d1fae5",
            name: "Griffiths Solutions",
            description: "Worked solutions to Introduction to Electrodynamics",
            tag: "Guide",
            url: "https://example.com",
          },
        ],
      },
      {
        course: "PH202",
        title: "Thermodynamics",
        items: [
          {
            id: 28,
            icon: Video,
            iconColor: "#dc2626",
            iconBg: "#fee2e2",
            name: "Thermo Lectures",
            description: "Full thermodynamics lecture series",
            tag: "Video",
            url: "https://example.com",
          },
        ],
      },
    ],
    3: [
      {
        course: "PH301",
        title: "Quantum Mechanics",
        items: [
          {
            id: 29,
            icon: Link,
            iconColor: "#7c3aed",
            iconBg: "#ede9fe",
            name: "Quantum Country",
            description: "Interactive essay on quantum computing fundamentals",
            tag: "Tutorial",
            url: "https://quantum.country",
          },
          {
            id: 30,
            icon: FileText,
            iconColor: "#2563eb",
            iconBg: "#dbeafe",
            name: "QM Lecture Notes",
            description: "Comprehensive quantum mechanics notes from Oxford",
            tag: "Article",
            url: "https://example.com",
          },
        ],
      },
      {
        course: "PH302",
        title: "Relativity",
        items: [
          {
            id: 31,
            icon: Video,
            iconColor: "#dc2626",
            iconBg: "#fee2e2",
            name: "Einstein's Relativity",
            description:
              "Accessible video series on special and general relativity",
            tag: "Video",
            url: "https://example.com",
          },
        ],
      },
    ],
  },
};

const tagColors = {
  Tutorial: { color: "#6d28d9", bg: "#ede9fe" },
  Article: { color: "#1d4ed8", bg: "#dbeafe" },
  Video: { color: "#b91c1c", bg: "#fee2e2" },
  Guide: { color: "#065f46", bg: "#d1fae5" },
  Docs: { color: "#92400e", bg: "#fef3c7" },
  Tool: { color: "#374151", bg: "#f3f4f6" },
};

const ResourceItem = ({ item }) => {
  const IconComponent = item.icon;
  const tag = tagColors[item.tag] || { color: "#374151", bg: "#f3f4f6" };

  return (
    <div className="resource-item">
      <div className="resource-icon" style={{ backgroundColor: item.iconBg }}>
        <IconComponent size={20} color={item.iconColor} />
      </div>
      <div className="resource-info">
        <span className="resource-name">{item.name}</span>
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

const Resources = () => {
  const { selectedProgram, selectedYear } = useOutletContext();

  const sections = allResources[selectedProgram]?.[selectedYear] ?? [];

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
