import {
  IoNotificationsOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import "./css/Header.css";
import NotificationModal from "../Pages/Dashboard/NotificationModal";
import { useEffect, useState } from "react";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";

    return "Good Evening";
  };

  useEffect(() => {
    console.log("Tasks updated:", tasks.length);
  }, [tasks]);

  return (
    <>
      <header className="dashboard_header">
        <div className="header_left">
          <button
            className="mobile_menu_btn"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          </button>

          <div>
            <h2>{getGreeting()}</h2>
            <p>Managing {tasks.length} active tasks today</p>
          </div>
        </div>

        <div className="header_right">
          <button
            className="notification_btn"
            onClick={() => setShowNotificationModal(true)}
          >
            <IoNotificationsOutline />

            <span className="notification_badge">
              {tasks.filter((task) => !task.completed).length}
            </span>
          </button>
        </div>
      </header>

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </>
  );
};

export default Header;
