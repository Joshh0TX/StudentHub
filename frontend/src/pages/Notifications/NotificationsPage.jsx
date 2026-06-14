import React, { useState, useEffect } from 'react';
import Notifications from './Notifications';

const NotificationsPage = () => {
  const [notifList, setNotifList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mark all as read when page opens
  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    markAllRead();
  }, []);

  const handleDismiss = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifList((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error('Error dismissing notification:', err);
    }
  };

  // Map backend type to your existing badge types
  const mapType = (type) => {
    const map = {
      like: 'newsroom',
      comment: 'comment',
      reply: 'comment',
      comment_like: 'comment',
      friend_request: 'connect',
      friend_accept: 'connect',
    };
    return map[type] || 'newsroom';
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  if (loading) return <div className="notif-page"><p>Loading...</p></div>;

  return (
    <div className="notif-page">
      {notifList.length > 0 ? (
        <div className="notif-list">
          {notifList.map((notif) => (
            <Notifications
              key={notif.id}
              data={{
                id: notif.id,
                type: mapType(notif.type),
                unread: !notif.isRead,
                user: `${notif.sender?.f_name} ${notif.sender?.l_name}`,
                text: notif.message,
                preview: '',
                time: timeAgo(notif.createdAt),
                avatar: `${notif.sender?.f_name?.[0] || ''}${notif.sender?.l_name?.[0] || ''}`,
              }}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      ) : (
        <div className="profile-empty-state">
          <p>No new notifications</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;