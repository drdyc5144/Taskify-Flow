import { useNavigate, useLocation } from "react-router-dom";
import {
  IoStatsChartOutline,
  IoListOutline,
  IoPieChartOutline,
  IoPersonOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import "./css/Sidebar.css";
import { IoNotificationsOutline } from "react-icons/io5";
import { useState } from "react";
import LogoutModal from "./Modals/LogoutModal";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const capitalizeName = (name) => {
    if (!name) return "User";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getInitials = (fullName) => {
    if (!fullName) return "?";
    const nameParts = fullName.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    const firstNameInitial = nameParts[0].charAt(0);
    const lastNameInitial = nameParts[nameParts.length - 1].charAt(0);
    return (firstNameInitial + lastNameInitial).toUpperCase();
  };

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <IoStatsChartOutline /> },
    { path: "/dashboard/profile", name: "Profile", icon: <IoPersonOutline /> },
    {
      path: "/dashboard/notifications",
      name: "Notifications",
      icon: <IoNotificationsOutline />,
    },
    {
      path: "/dashboard/analytics",
      name: "Analytics",
      icon: <IoPieChartOutline />,
    },
  ];

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("user");
    localStorage.removeItem("resetEmail");
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar_header">
          <div className="logo_area">
            <img
              src="https://i.postimg.cc/SNrfzGLp/Taskify.png"
              alt="Taskify Logo"
              className="sidebar_logo"
            />
          </div>
        </div>

        <nav className="sidebar_nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav_item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar_footer">
          {isOpen && (
            <div className="user_info">
              <div className="user_avatar">
                {getInitials(savedUser.fullName)}
              </div>
              <div className="user_details">
                <p className="user_name">
                  {capitalizeName(savedUser.fullName)}
                </p>
                <p className="user_email">
                  {savedUser.email || "user@email.com"}
                </p>
              </div>
            </div>
          )}

          <button className="nav_item logout" onClick={handleLogoutClick}>
            <IoLogOutOutline />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;
