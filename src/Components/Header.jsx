import {
  IoNotificationsOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import "./css/Header.css";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good evening";
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const handleNotificationClick = () => {
    navigate("/dashboard/notifications");
  };

  return (
    <header className="dashboard_header">
      <div className="header_left">
        <button className="mobile_menu_btn" onClick={toggleSidebar}>
          {isSidebarOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>
        <div>
          <h2>{getGreeting()}</h2>
          <p>Managing {tasks.length} active tasks today</p>
        </div>
      </div>
      <div className="header_right">
        <button className="notification_btn" onClick={handleNotificationClick}>
          <IoNotificationsOutline />
        </button>
      </div>
    </header>
  );
};

export default Header;
