import React from 'react'
import "./Notifications.css";

const Notifications = ({ data, onDismiss }) => {
    return (
        <div className={`notif-item ${data.unread ? "unread" : ""}`}>
            <button onClick={() => onDismiss(data.id)}>x</button>
            <div className='notif-avatar'>{data.avatar}</div>
            <div className="notif-body">
                <span className={`badge badge-${data.type}`}>{data.type}</span>
                <p className="notif-text">
                    <strong>{data.user}</strong> {data.text}
                </p>
                <p className="notif-preview">{data.preview}</p>
                <span className="notif-time">{data.time}</span>
            </div>
        </div>
    )
}

export default Notifications