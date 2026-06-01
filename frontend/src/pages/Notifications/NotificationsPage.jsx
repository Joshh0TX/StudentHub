import React, { useState } from 'react'
import { notifications } from './notificationsData'
import Notifications from './Notifications'

const NotificationsPage = () => {
    // 🎨 DEV TIP: To test or force the empty look right now, change this to: useState([])
    const [notifList, setNotifList] = useState([])

    const handleDismiss = (id) => {
        // Keeps your exact filter structure intact
        setNotifList(notifList.filter((notif) => notif.id !== id))
    }

    return (
        <div className="notif-page">
            
            
            {/* 🎯 DYNAMIC RENDERING TRIGGER */}
            {notifList.length > 0 ? (
                <div className="notif-list">
                    {notifList.map((notif) => (
                        <Notifications key={notif.id} data={notif} onDismiss={handleDismiss} />
                    ))}
                </div>
            ) : (
                /* 📭 THIS SECTIONS SHOWS AUTOMATICALLY WHEN ARRAY LENGTH IS 0 */
                <div className="profile-empty-state">
                    <p>No new notifications</p>
                </div>
            )}
        </div>
    )
}

export default NotificationsPage