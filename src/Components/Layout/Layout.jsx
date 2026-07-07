import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import "./Layout.css";

const Layout = ({ children }) => {
  // Sidebar starts open on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 768
  );

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Read user from localStorage
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const user = storedUser || {
    name: "",
    email: "",
  };

  return (
    <div className="layout">
      {/* Overlay (Mobile only) */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div
          className="sidebar_overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
      />

      <div
        className={`layout_main ${
          sidebarOpen ? "expanded" : "collapsed"
        }`}
      >
        <Header
          toggleSidebar={() => setSidebarOpen((prev) => !prev)}
          isSidebarOpen={sidebarOpen}
          user={user}
        />

        <main className="layout_content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;