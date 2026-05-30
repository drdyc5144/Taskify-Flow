import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import "../../styles/Layout.css";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Try to read user from localStorage; fallback to existing hardcoded user
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      return null;
    }
  })();

  const user = storedUser || {
    name: "",
    email: "",
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} />
      <div className={`layout_main ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          user={user}
        />
        <main className="layout_content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
