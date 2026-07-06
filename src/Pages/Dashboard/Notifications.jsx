import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout/Layout";
import {
  IoNotificationsOutline,
  IoNotificationsOffOutline,
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoCloseCircleOutline,
  IoTrashOutline,
  IoCheckmarkDoneCircleOutline,
  IoArrowBackOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "./DashboardStyles/Notifications.css";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../Components/Modals/ConfirmModal";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const baseURL = import.meta.env.VITE_TASKIFY_BASE_URL;
  const token = localStorage.getItem("Token");

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const notificationsArray = response.data.data || [];
      setNotifications(notificationsArray);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch notifications",
      );
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const [filter, setFilter] = useState("all");

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif._id === id ? { ...notif, isRead: true } : notif,
      ),
    );
  };

  const markAllAsRead = async () => {
    try {
      const promises = notifications.map((item) =>
        axios.patch(
          `${baseURL}/notifications/${item._id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      const response = await Promise.all(promises);
      console.log("markAllAsRead api responses:", response);

      setNotifications(
        notifications.map((item) => ({ ...item, isRead: true })),
      );
      toast.success(
        response?.data?.message || "All notifications marked as read",
      );
    } catch (error) {
      console.log("markAllAsRead api error", error);
      toast.error(
        error.response?.data?.message || "Failed to mark all as read",
      );
    }
  };

  // const markAllAsRead = async () => {
  //   try {
  //     const promises = notifications.map((item) =>
  //       axios.patch(
  //         `${baseURL}/notifications/${item._id}/read`,
  //         {},
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       ),
  //     );

  //     await Promise.all(promises);
  //     setNotifications(
  //       notifications.map((item) => ({ ...item, isRead: true })),
  //     );
  //     toast.success("All notifications marked as read");
  //   } catch (error) {
  //     toast.error(
  //       error.response?.data?.message || "Failed to mark all as read",
  //     );
  //   }
  // };

  const deleteNotification = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(notifications.filter((item) => item._id !== id));
      toast.success(
        response.data.message || "Notification deleted successfully",
      );
      console.log("Delete response:", response.data);
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete notification",
      );
    }
  };

  const deleteAllNotifications = async () => {
    setShowConfirmModal(false);
    try {
      await axios.delete(`${baseURL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("All notifications deleted successfully");
      setNotifications([]);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to delete notifications",
      );
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "overdue":
        return <IoWarningOutline />;
      case "upcoming":
        return <IoInformationCircleOutline />;
      case "created":
        return <IoCheckmarkCircleOutline />;
      default:
        return <IoInformationCircleOutline />;
    }
  };

  const getTypeTitle = (type) => {
    switch (type) {
      case "overdue":
        return "Task Overdue";
      case "upcoming":
        return "Task Due Soon";
      case "created":
        return "Task Created";
      default:
        return "Notification";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.isRead;
    if (filter === "read") return item.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <Layout>
        <div className="notifications_loading">
          <div className="loading_spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="notifications_page">
        <div className="notifications_header">
          <div className="header_left">
            <button className="back_btn" onClick={() => navigate("/dashboard")}>
              <IoArrowBackOutline />
            </button>
            <div className="header_title">
              <IoNotificationsOutline />
              <h1>Notifications</h1>
              {unreadCount > 0 && (
                <span className="unread_count">{unreadCount}</span>
              )}
            </div>
          </div>
          <div className="header_actions">
            {notifications.length > 0 && (
              <>
                <button className="mark_all_btn" onClick={markAllAsRead}>
                  <IoCheckmarkDoneCircleOutline />
                  Mark all as read
                </button>
                <button
                  className="delete_all_btn"
                  onClick={() => setShowConfirmModal(true)}
                >
                  <IoTrashOutline />
                  Delete all
                </button>
              </>
            )}
          </div>
        </div>

        <div className="notifications_filters">
          <button
            className={`filter_btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter_btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter_btn ${filter === "read" ? "active" : ""}`}
            onClick={() => setFilter("read")}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        <div className="notifications_list">
          {filteredNotifications.length === 0 ? (
            <div className="empty_notifications">
              <div className="empty_icon">
                <IoNotificationsOffOutline />
              </div>
              <h3>No notifications</h3>
              <p>You're all caught up!</p>
              <button
                className="go_back_btn"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            filteredNotifications.map((item, index) => (
              <div
                key={item._id || index}
                className={`notification_card ${item.isRead ? "read" : "unread"}`}
                onClick={() => !item.isRead && markAsRead(item._id)}
              >
                <div className="notification_icon_wrapper">
                  {getTypeIcon(item.type)}
                </div>
                <div className="notification_details">
                  <div className="notification_title_wrapper">
                    <strong>{getTypeTitle(item.type)}</strong>
                    {!item.isRead && <span className="new_badge">New</span>}
                  </div>
                  <p className="notification_message">{item.message}</p>
                  <span className="notification_time">
                    {formatTime(item.createdAt)}
                  </span>
                </div>
                <button
                  className="delete_notif_btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item._id);
                  }}
                >
                  <IoTrashOutline />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={deleteAllNotifications}
        title="Delete All Notifications"
        message="Are you sure you want to delete all notifications? This action cannot be undone."
      />
    </Layout>
  );
};

export default Notifications;
