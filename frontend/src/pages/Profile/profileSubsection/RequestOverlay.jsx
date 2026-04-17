import './RequestOverlay.css';

export default function RequestOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Mock data - replace with your API data later
  const requests = [
    { id: 1, name: "Sarah John", dept: "Architecture", img: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "David Chen", dept: "Computer Science", img: "https://i.pravatar.cc/150?u=2" },
  ];

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="request-modal" onClick={(e) => e.stopPropagation()}>
        <div className="request-header">
          <h2>Recent Requests</h2>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>

        <div className="request-list">
          {requests.map((req) => (
            <div key={req.id} className="request-card">
              <img src={req.img} alt={req.name} className="req-avatar" />
              <div className="req-info">
                <h3>{req.name}</h3>
                <p>{req.dept}</p>
              </div>
              <div className="req-actions">
                <button className="btn-decline">Decline</button>
                <button className="btn-accept">Accept</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}