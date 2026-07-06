import React from "react";
import {
  IoCloseOutline,
  IoWarningOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import "./css/LogoutModal.css";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="logout_modal_overlay" onClick={onClose}>
      <div className="logout_modal" onClick={(e) => e.stopPropagation()}>
        <div className="logout_modal_header">
          <div className="logout_icon_wrapper">
            <IoWarningOutline />
          </div>
          <button className="logout_close_btn" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className="logout_modal_body">
          <h3>Confirm Logout</h3>
          <p>
            Are you sure you want to logout? You will need to login again to
            access your account.
          </p>
        </div>

        <div className="logout_modal_footer">
          <button className="logout_cancel_btn" onClick={onClose}>
            Cancel
          </button>
          <button className="logout_confirm_btn" onClick={onConfirm}>
            <IoLogOutOutline />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
