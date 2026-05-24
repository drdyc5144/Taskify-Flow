import { IoNotificationsOutline, IoMenuOutline } from "react-icons/io5";
import "../Styles/Header.css";

const Header = ({ toggleSidebar }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good evening";
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  return (
    <header className="dashboard_header">
      <button className="mobile_menu_btn" onClick={toggleSidebar}>
        <IoMenuOutline />
      </button>
      <div className="header_left">
        <h2>{getGreeting()} </h2>
        <p>Managing {tasks.length} active tasks today</p>
      </div>
      <div className="header_right">
        <button className="notification_btn">
          <IoNotificationsOutline />
          <span className="notification_badge">
            {tasks.filter((task) => !task.completed).length}
          </span>
        </button>
        {/* <div className="header_user">
          <div className="user_avatar_small">NG</div>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
