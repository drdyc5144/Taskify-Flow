import { useNavigate, useLocation } from "react-router-dom";
import {
  IoStatsChartOutline,
  IoPieChartOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import "./css/Sidebar.css";
import { useState, useEffect } from "react";
import LogoutModal from "./Modals/LogoutModal";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <IoStatsChartOutline />,
    },
    {
      path: "/dashboard/profile",
      name: "Profile",
      icon: <IoPersonOutline />,
    },
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

  const handleNavigate = (path) => {
    navigate(path);
    // Close sidebar on mobile
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogoutClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userInfor");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("resetEmail");
    localStorage.removeItem("tasks");
    localStorage.removeItem("notification_count");
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobile && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobile, isOpen, setIsOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="sidebar_overlay" onClick={handleOverlayClick} />
      )}

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
              className={`nav_item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => handleNavigate(item.path)}
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
