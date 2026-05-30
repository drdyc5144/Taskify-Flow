import React, { useState } from "react";
import Layout from "../../Components/Layout/Layout";
import "./DashboardStyles/MyTasks.css";
import {
  IoAddOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoCheckmarkOutline,
  IoTimeOutline,
  IoSyncOutline,
  IoCheckmarkDoneCircleOutline,
} from "react-icons/io5";
import { MdOutlineTask } from "react-icons/md";

const MyTasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete project documentation",
      description:
        "Write comprehensive documentation for the Taskify project including API docs and user guide",
      status: "completed",
      priority: "high",
      dueDate: "2024-05-25",
      createdAt: "2024-05-20",
    },
    {
      id: 2,
      title: "Review pull requests",
      description: "Review and merge pending PRs from the team",
      status: "in_progress",
      priority: "medium",
      dueDate: "2024-05-26",
      createdAt: "2024-05-21",
    },
    {
      id: 3,
      title: "Fix navigation bug",
      description: "Fix the routing issue in the dashboard sidebar",
      status: "pending",
      priority: "high",
      dueDate: "2024-05-24",
      createdAt: "2024-05-22",
    },
    {
      id: 4,
      title: "Update user profile page",
      description: "Add edit functionality and avatar upload to profile page",
      status: "pending",
      priority: "low",
      dueDate: "2024-05-28",
      createdAt: "2024-05-23",
    },
    {
      id: 5,
      title: "Write unit tests",
      description: "Write unit tests for authentication and task management",
      status: "completed",
      priority: "medium",
      dueDate: "2024-05-23",
      createdAt: "2024-05-19",
    },
    {
      id: 6,
      title: "Design new dashboard UI",
      description: "Create modern dashboard design with analytics charts",
      status: "in_progress",
      priority: "high",
      dueDate: "2024-05-27",
      createdAt: "2024-05-22",
    },
    {
      id: 7,
      title: "Optimize database queries",
      description: "Improve query performance for task fetching",
      status: "pending",
      priority: "medium",
      dueDate: "2024-05-29",
      createdAt: "2024-05-24",
    },
    {
      id: 8,
      title: "Deploy to production",
      description: "Deploy the latest build to production server",
      status: "completed",
      priority: "high",
      dueDate: "2024-05-22",
      createdAt: "2024-05-18",
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "in_progress":
        return "status-in_progress";
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <IoCheckmarkDoneCircleOutline />;
      case "in_progress":
        return <IoSyncOutline />;
      default:
        return <IoTimeOutline />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return "Medium";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.status === "completed";
    if (filter === "pending") return task.status === "pending";
    if (filter === "high") return task.priority === "high";
    return true;
  });

  const handleCompleteTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
            }
          : task,
      ),
    );
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  return (
    <Layout>
      <div className="tasks_page">
        <div className="page_header">
          <h1>My Tasks</h1>
          <button
            className="create_task_btn"
            onClick={() => setShowCreateModal(true)}
          >
            <IoAddOutline /> New Task
          </button>
        </div>

        <div className="filters_section">
          <button
            className={`filter_btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({tasks.length})
          </button>
          <button
            className={`filter_btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({tasks.filter((t) => t.status === "pending").length})
          </button>
          <button
            className={`filter_btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed ({tasks.filter((t) => t.status === "completed").length})
          </button>
          <button
            className={`filter_btn ${filter === "high" ? "active" : ""}`}
            onClick={() => setFilter("high")}
          >
            High Priority ({tasks.filter((t) => t.priority === "high").length})
          </button>
        </div>

        <div className="tasks_list">
          {filteredTasks.length === 0 ? (
            <div className="empty_state_large">
              <div className="empty_icon">
                <MdOutlineTask />
              </div>
              <h3>No tasks yet</h3>
              <p>Create your first task to get started</p>
              <button
                className="create_first_btn"
                onClick={() => setShowCreateModal(true)}
              >
                <IoAddOutline /> Create New Task
              </button>
            </div>
          ) : (
            <div className="tasks_grid">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task_card ${task.status === "completed" ? "completed_task" : ""}`}
                >
                  <div className="task_checkbox">
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => handleCompleteTask(task.id)}
                    />
                  </div>
                  <div className="task_content">
                    <h4
                      className={
                        task.status === "completed" ? "strikethrough" : ""
                      }
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p
                        className={
                          task.status === "completed" ? "strikethrough" : ""
                        }
                      >
                        {task.description}
                      </p>
                    )}
                    <div className="task_meta">
                      <span
                        className={`priority_tag ${getPriorityClass(task.priority)}`}
                      >
                        {getPriorityText(task.priority)}
                      </span>
                      {task.dueDate && (
                        <span className="due_date">
                          📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span
                        className={`status_tag ${getStatusClass(task.status)}`}
                      >
                        {getStatusIcon(task.status)}
                        {getStatusText(task.status)}
                      </span>
                    </div>
                  </div>
                  <div className="task_actions">
                    <button className="action_btn edit">
                      <IoCreateOutline />
                    </button>
                    <button
                      className="action_btn delete"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal - Add this if needed */}
      {showCreateModal && (
        <div
          className="modal_overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header">
              <h3>Create New Task</h3>
              <button
                className="close_btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <form>
              <div className="form_group">
                <label>Task Name</label>
                <input type="text" placeholder="Enter task name" />
              </div>
              <div className="form_group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Enter task description"
                ></textarea>
              </div>
              <div className="form_row">
                <div className="form_group">
                  <label>Priority</label>
                  <select>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form_group">
                  <label>Due Date</label>
                  <input type="date" />
                </div>
              </div>
              <div className="modal_actions">
                <button
                  type="button"
                  className="cancel_btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit_btn">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MyTasks;
