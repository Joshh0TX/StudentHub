
import React, { useState } from 'react'
import { notifications } from './notificationsData'
import Notifications from './Notifications'

const NotificationsPage = () => {

    const [notifList, setNotifList] = useState(notifications)

    const handleDismiss = (id) => {
        setNotifList(notifList.map((notif) =>
            notif.id === id ? { ...notif, unread: false } : notif
        ))
    }

    return (
        <div className="notif-page">
            <h2 className="notif-title">Notifications</h2>
            <div className="notif-list">
                {notifList.map((notif) => (
                    <Notifications key={notif.id} data={notif} onDismiss={handleDismiss} />
                ))}
            </div>
        </div>
    )
}

export default NotificationsPage