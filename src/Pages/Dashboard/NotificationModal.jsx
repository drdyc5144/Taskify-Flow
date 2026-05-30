import React, { useEffect, useState } from "react";
import {
  IoCloseOutline,
  IoNotificationsOutline,
  IoNotificationsOffOutline,
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoCloseCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import "./DashboardStyles/NotificationModal.css";
import axios from "axios";
import { toast } from "react-toastify";

const NotificationModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const baseURL = import.meta.env.TVITE_BASE_URL;
  const token = localStorage.getItem("Token");

  const fetchNotification = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(
        response?.data?.message || "Notification deleted successfully",
      );
      console.log("Fetch response:", response.data);

      const notificationsArray =
        response?.data?.data || response?.data?.notifications || [];
      setNotifications(notificationsArray);
    } catch (error) {
      console.log("Fetch error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch notifications",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotification();
    }
  }, [isOpen]);

  const deleteNotification = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Delete response:", response.data);
      toast.success(
        response.data.message || "Notification deleted successfully",
      );

      setNotifications(
        notifications.filter((item) => item._id !== id && item.id !== id),
      );
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch notifications",
      );
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "success":
        return <IoCheckmarkCircleOutline />;
      case "info":
        return <IoInformationCircleOutline />;
      case "warning":
        return <IoWarningOutline />;
      case "error":
        return <IoCloseCircleOutline />;
      default:
        return <IoInformationCircleOutline />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification_modal_overlay" onClick={onClose}>
      <div className="notification_modal" onClick={(e) => e.stopPropagation()}>
        <div className="notification_header">
          <div className="notification_title">
            <IoNotificationsOutline />
            <h3>Notifications</h3>
          </div>
          <button className="close_btn" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className="notification_list">
          {isLoading ? (
            <div className="loading_notifications">
              <div className="loading_spinner_small"></div>
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty_notifications">
              <div className="empty_icon">
                <IoNotificationsOffOutline />
              </div>
              <p>No notifications yet</p>
              <span>When you have notifications, they will appear here</span>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id || item.id}
                className={`notification_item ${item.type}`}
              >
                <div className="notification_icon">
                  {getTypeIcon(item.type)}
                </div>
                <div className="notification_content">
                  <div className="notification_message">
                    <strong>{item.title || item.type}</strong>
                    <p>{item.message}</p>
                  </div>
                  {/* <div className="notification_time">
                    {notif.time || notif.createdAt}
                  </div> */}
                </div>
                <button
                  className="delete_notif_btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item._id || item.id);
                  }}
                >
                  <IoTrashOutline />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
