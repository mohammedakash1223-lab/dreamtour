import { Notification } from "../types";

interface SubNotificationsProps {
  notifications: Notification[];
  onBack: () => void;
}

export default function SubNotifications({ notifications, onBack }: SubNotificationsProps) {
  return (
    <div id="notifications-view" className="app-section active text-black min-h-screen">
      <div className="back-nav" onClick={onBack}>
        <i className="fas fa-arrow-left"></i> Notifications
      </div>
      <div id="notif-list-container" className="bg-white min-h-screen pb-[65px]">
        {notifications.length === 0 ? (
          <div className="empty-msg text-center p-[30px] text-gray-400 font-semibold">
            No Notifications
          </div>
        ) : (
          notifications.map((n, idx) => (
            <div key={idx} className="p-[15px] border-b border-[#eee] font-bold text-left text-gray-800">
              {n.title}
              <br />
              <span className="font-normal text-[13px] color-[#666]">{n.body}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
