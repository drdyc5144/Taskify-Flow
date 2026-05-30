import React from "react";
import { IoCloseOutline, IoWarningOutline } from "react-icons/io5";
import "./css/ConfirmModal.css";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm_modal_overlay" onClick={onClose}>
      <div className="confirm_modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm_modal_header">
          <div className="confirm_icon">
            <IoWarningOutline />
          </div>
          <button className="confirm_close_btn" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>
        <div className="confirm_modal_body">
          <h3>{title || "Confirm Delete"}</h3>
          <p>{message || "Are you sure you want to delete this?"}</p>
        </div>
        <div className="confirm_modal_footer">
          <button className="confirm_cancel_btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm_delete_btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
