import { useState, useEffect, useRef, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";
import {
  AlertCircle,
  ExternalLink,
  Plus,
  X,
  Upload,
  Trash2,
  Download,
  RefreshCw,
  Link2,
  FileText,
  Film,
  BookOpen,
  Wrench,
  HelpCircle,
  File,
} from "lucide-react";
import "./Resources.css";

const API = import.meta.env.VITE_API_URL;

// ── Tag config (visual category — stored as `category`, never sent as `type`) ─
const TAGS = [
  { label: "Tutorial", color: "#6d28d9", bg: "#ede9fe", Icon: BookOpen },
  { label: "Article", color: "#1d4ed8", bg: "#dbeafe", Icon: FileText },
  { label: "Video", color: "#b91c1c", bg: "#fee2e2", Icon: Film },
  { label: "Guide", color: "#065f46", bg: "#d1fae5", Icon: BookOpen },
  { label: "Docs", color: "#92400e", bg: "#fef3c7", Icon: FileText },
  { label: "Tool", color: "#374151", bg: "#f3f4f6", Icon: Wrench },
  { label: "Other", color: "#6b7280", bg: "#f9fafb", Icon: HelpCircle },
];

const tagMap = Object.fromEntries(TAGS.map((t) => [t.label, t]));

// Derives the backend enum value from the upload mode and file extension.
// Backend accepts: "pdf" | "link" | "video" | "notes"
const deriveBackendType = (mode, file) => {
  if (mode === "link") return "link";
  if (!file) return "notes";
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["mp4", "mov", "avi", "webm"].includes(ext)) return "video";
  return "notes";
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const formatBytes = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const apiFetch = async (endpoint, options = {}, token) => {
  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || !contentType.includes("application/json")) {
    const text = await res.text();
    let msg;
    try {
      msg = JSON.parse(text).error || "An error occurred";
    } catch {
      msg = text.slice(0, 150) || `Server error ${res.status}`;
    }
    throw new Error(msg);
  }
  return res.json();
};

// ── Upload Resource Modal ──────────────────────────────────────────────────────
const UploadModal = ({ onClose, onCreated, selectedProgram, selectedYear }) => {
  const { getToken } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Tutorial", // visual label — stored as `category` in DB
    courseCode: "",
    courseTitle: "",
    mode: "link", // UI toggle only: "link" | "file"
    url: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (f) => {
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) {
      setError("File must be under 50 MB.");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.courseCode.trim()) return setError("Course code is required.");
    if (form.mode === "link" && !form.url.trim())
      return setError("Please enter a URL.");
    if (form.mode === "file" && !file) return setError("Please select a file.");

    setLoading(true);
    setError(null);

    try {
      const token = getToken?.();
      const backendType = deriveBackendType(form.mode, file);
      let data;

      if (form.mode === "file") {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("title", form.title.trim());
        fd.append("description", form.description.trim());
        fd.append("type", backendType);
        fd.append("category", form.category);
        fd.append("courseCode", form.courseCode.trim().toUpperCase());
        fd.append("courseTitle", form.courseTitle.trim());
        fd.append("department", selectedProgram);
        fd.append("year", String(selectedYear));
        data = await apiFetch(
          "/api/resources",
          { method: "POST", body: fd },
          token,
        );
      } else {
        data = await apiFetch(
          "/api/resources",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: form.title.trim(),
              description: form.description.trim(),
              type: backendType,
              category: form.category,
              courseCode: form.courseCode.trim().toUpperCase(),
              courseTitle: form.courseTitle.trim(),
              department: selectedProgram,
              year: selectedYear,
              url: form.url.trim(),
            }),
          },
          token,
        );
      }

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
      <div className="modal--resource">
        <div className="modal-header">
          <h2>Add Resource</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="modal-error">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div className="modal-Rbody modal-Rbody--scroll">
          <div className="resource-type-toggle">
            <button
              className={`type-btn ${form.mode === "link" ? "type-btn--active" : ""}`}
              onClick={() => setForm((p) => ({ ...p, mode: "link" }))}
            >
              <Link2 size={15} /> Link
            </button>
            <button
              className={`type-btn ${form.mode === "file" ? "type-btn--active" : ""}`}
              onClick={() => setForm((p) => ({ ...p, mode: "file" }))}
            >
              <Upload size={15} /> File Upload
            </button>
          </div>

          <div className="modal-field">
            <label>
              Resource Name <span>*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. LeetCode Algorithm Practice"
              maxLength={100}
            />
          </div>

          <div className="modal-field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What is this resource about?"
              rows={3}
              maxLength={300}
            />
          </div>

          <div className="modal-two-col">
            <div className="modal-field">
              <label>
                Course Code <span>*</span>
              </label>
              <input
                name="courseCode"
                value={form.courseCode}
                onChange={handleChange}
                placeholder="e.g. CS201"
                maxLength={20}
              />
            </div>
            <div className="modal-field">
              <label>Course Title</label>
              <input
                name="courseTitle"
                value={form.courseTitle}
                onChange={handleChange}
                placeholder="e.g. Data Structures"
                maxLength={100}
              />
            </div>
          </div>

          <div className="modal-field">
            <label>Resource Category</label>
            <div className="tag-selector">
              {TAGS.map((t) => (
                <button
                  key={t.label}
                  className={`tag-option ${form.category === t.label ? "tag-option--active" : ""}`}
                  style={
                    form.category === t.label
                      ? {
                          backgroundColor: t.bg,
                          color: t.color,
                          borderColor: t.color,
                        }
                      : {}
                  }
                  onClick={() => setForm((p) => ({ ...p, category: t.label }))}
                >
                  <t.Icon size={13} /> {t.label}
                </button>
              ))}
            </div>
          </div>

          {form.mode === "link" && (
            <div className="modal-field">
              <label>
                URL <span>*</span>
              </label>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://..."
                type="url"
              />
            </div>
          )}

          {form.mode === "file" && (
            <div className="modal-field">
              <label>
                File <span>*</span>
              </label>
              <div
                className={`file-dropzone ${dragOver ? "file-dropzone--over" : ""} ${file ? "file-dropzone--has-file" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.txt"
                />
                {file ? (
                  <div className="file-selected">
                    <File size={24} />
                    <div>
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{formatBytes(file.size)}</p>
                    </div>
                    <button
                      className="file-clear"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="file-prompt">
                    <Upload size={28} color="#9ca3af" />
                    <p>
                      Drag and drop or <span>browse</span>
                    </p>
                    <p className="file-hint">
                      PDF, Word, PowerPoint, images, video, audio · max 50 MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

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
                <RefreshCw size={14} className="spinner" /> Uploading...
              </>
            ) : (
              <>
                <Plus size={14} /> Add Resource
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Resource Item ──────────────────────────────────────────────────────────────
const ResourceItem = ({ item, onDelete, canDelete }) => {
  const typeToCategory = {
    link: "Other",
    pdf: "Docs",
    video: "Video",
    notes: "Tutorial",
  };

  const categoryKey = item.category || typeToCategory[item.type] || "Other";
  const tag = tagMap[categoryKey] || tagMap["Other"];
  const isFile = item.isFile || item.is_file;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    if (confirmDelete) {
      onDelete(item.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="resource-item">
      <div
        className="resource-icon-bubble"
        style={{ backgroundColor: tag.bg, color: tag.color }}
      >
        <tag.Icon size={18} />
      </div>

      <div className="resource-info">
        <span className="resource-name">{item.title}</span>
        {item.description && (
          <span className="resource-desc">{item.description}</span>
        )}
        <div className="resource-meta-row">
          <span
            className="resource-tag"
            style={{ color: tag.color, backgroundColor: tag.bg }}
          >
            {item.category || item.tag}
          </span>
          {isFile && item.fileName && (
            <span className="resource-filename">
              <File size={11} /> {item.fileName}
              {item.fileSize ? ` · ${formatBytes(item.fileSize)}` : ""}
            </span>
          )}
        </div>
      </div>

      <div className="resource-actions">
        {isFile ? (
          <a
            href={item.url}
            download={item.fileName || true}
            className="resource-action-btn resource-action-btn--download"
            title="Download file"
          >
            <Download size={16} />
          </a>
        ) : (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="resource-action-btn resource-action-btn--link"
            title="Open link"
          >
            <ExternalLink size={16} />
          </a>
        )}

        {canDelete && (
          <button
            className={`resource-action-btn resource-action-btn--delete ${confirmDelete ? "resource-action-btn--confirm" : ""}`}
            onClick={handleDeleteClick}
            title={confirmDelete ? "Click again to confirm" : "Delete resource"}
          >
            <Trash2 size={16} />
            {confirmDelete && <span>Confirm?</span>}
          </button>
        )}
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const Resources = () => {
  const { selectedProgram, selectedYear } = useOutletContext();
  const { user, loading: authLoading, getToken } = useAuth(); // +++ destructure authLoading
  const { canCreateIn, canModify } = usePermissions();
  const userCanCreate = canCreateIn(selectedProgram, selectedYear);

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchResources = useCallback(async () => {
    if (!user?.id || !selectedProgram || !selectedYear) return; // +++ guard on user?.id
    setLoading(true);
    setError(null);
    try {
      const token = getToken?.();
      const data = await apiFetch(
        `/api/resources?department=${encodeURIComponent(selectedProgram)}&year=${selectedYear}`,
        {},
        token,
      );

      const grouped = data.reduce((acc, item) => {
        const key = item.courseCode || item.course_code || "Unknown";
        if (!acc[key]) {
          acc[key] = {
            course: key,
            title: item.courseTitle || item.course_title || "",
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
  }, [user?.id, selectedProgram, selectedYear, getToken]); // +++ user?.id in deps

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleCreated = (newResource) => {
    const key = newResource.courseCode || newResource.course_code || "Unknown";
    setSections((prev) => {
      const existing = prev.find((s) => s.course === key);
      if (existing) {
        return prev.map((s) =>
          s.course === key ? { ...s, items: [newResource, ...s.items] } : s,
        );
      }
      return [
        {
          course: key,
          title: newResource.courseTitle || newResource.course_title || "",
          items: [newResource],
        },
        ...prev,
      ];
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = getToken?.();
      await apiFetch(`/api/resources/${id}`, { method: "DELETE" }, token);
      setSections((prev) =>
        prev
          .map((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }))
          .filter((s) => s.items.length > 0),
      );
    } catch (err) {
      alert(err.message);
    }
  };

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
        <p>You must be logged in to view resources.</p>
      </div>
    );

  if (loading)
    return (
      <div className="groups-loading">
        <RefreshCw size={20} className="spinner" />
        <p>Loading resources...</p>
      </div>
    );

  if (error)
    return (
      <div className="groups-error">
        <AlertCircle size={20} />
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchResources}>
          Retry
        </button>
      </div>
    );

  return (
    <div className="resources-page">
      <div className="resources-header">
        <div>
          <h1>Educational Resources</h1>
          <p>
            {selectedProgram} — Year {selectedYear} curated learning materials
          </p>
        </div>
        <div className="resources-header-actions">
          <button
            className="btn-refresh-sm"
            onClick={fetchResources}
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          {userCanCreate && (
            <button
              className="btn-add-resource"
              onClick={() => setShowModal(true)}
            >
              <Plus size={16} /> Add Resource
            </button>
          )}
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="resources-empty-state">
          <BookOpen size={36} color="#d1d5db" />
          <p>No resources yet for this selection.</p>
          {userCanCreate && (
            <button
              className="btn-add-resource"
              onClick={() => setShowModal(true)}
            >
              <Plus size={14} /> Add the first resource
            </button>
          )}
        </div>
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
                  <ResourceItem
                    key={item.id}
                    item={item}
                    currentUserId={user?.id}
                    onDelete={handleDelete}
                    canDelete={canModify(item.createdBy ?? item.created_by)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
          selectedProgram={selectedProgram}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
};

export default Resources;
