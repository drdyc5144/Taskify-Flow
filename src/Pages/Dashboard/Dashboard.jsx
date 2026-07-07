import React, { useEffect, useState } from "react";
import Layout from "../../Components/Layout/Layout";
import "./DashboardStyles/Dashboard.css";
import {
  IoTimeOutline,
  IoAddOutline,
  IoCloseOutline,
  IoTrashOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FcProcess } from "react-icons/fc";
import { MdOutlineTask } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const token = localStorage.getItem("Token");
  const baseURL = import.meta.env.VITE_TASKIFY_BASE_URL;

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const [createTaskData, setCreateTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateTaskData({ ...createTaskData, [name]: value });
  };

  const fetchTask = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${baseURL}/tasks/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newTasks = response?.data?.data?.tasks || [];
      setTasks(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      console.log("fetchTask task response", response);
    } catch (error) {
      console.log("fetchTask error", error);
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/tasks`,
        {
          title: createTaskData.title,
          description: createTaskData.description,
          status: createTaskData.status,
          priority: createTaskData.priority,
          dueDate: createTaskData.dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Task created:", response);
      toast.success(response.data.message || "Task created successfully!");

      await fetchTask();

      setCreateTaskData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
      });
      setShowCreateModal(false);
    } catch (error) {
      console.log("error creating task", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, check your network",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("api delete resonse", response);
      toast.success(response.data.message || "Task deleted successfully");
      setTasks(tasks.filter((item) => item.id !== id && item._id !== id));
    } catch (error) {
      console.log("api delete resonse", error);
    }
  };

  const handleStatusChange = (taskId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    setTasks(
      tasks.map((task) =>
        task.id === taskId || task._id === taskId
          ? { ...task, status: newStatus }
          : task,
      ),
    );
  };

  if (isFetching) {
    return (
      <Layout>
        <div className="loading_container">
          <div className="loading_content">
            <img
              src="https://i.postimg.cc/SNrfzGLp/Taskify.png"
              alt="Taskify Logo"
              className="loading_logo_small"
            />
            <div className="loading_spinner_small"></div>
            <p>Loading your tasks...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard_page geist-content">
        <div className="stats_grid">
          <div className="stat_card total">
            <div className="stat_icon">
              <MdOutlineTask />
            </div>
            <h3>TOTAL TASKS</h3>
            <p className="stat_number">{stats.total}</p>
          </div>
          <div className="stat_card pending">
            <div className="stat_icon">
              <IoTimeOutline />
            </div>
            <h3>PENDING</h3>
            <p className="stat_number">{stats.pending}</p>
          </div>
          <div className="stat_card in_progress">
            <div className="stat_icon">
              <FcProcess />
            </div>
            <h3>IN PROGRESS</h3>
            <p className="stat_number">{stats.inProgress}</p>
          </div>
          <div className="stat_card completed">
            <div className="stat_icon">
              <IoMdCheckmarkCircleOutline />
            </div>
            <h3>COMPLETED</h3>
            <p className="stat_number">{stats.completed}</p>
          </div>
        </div>

        <div className="recent_activity">
          <div className="section_header">
            <h3>Recent Activity</h3>
            <button
              className="create_task_btn"
              onClick={() => setShowCreateModal(true)}
              disabled={isLoading}
            >
              <IoAddOutline /> Create New Task
            </button>
          </div>

          <div className="table_wrapper">
            <table className="activity_table">
              <thead>
                <tr>
                  <th>TASK</th>
                  <th>STATUS</th>
                  <th>PRIORITY</th>
                  <th>DUE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty_state">
                      <div className="empty_content">
                        <div className="empty_icon">
                          <MdOutlineTask size={48} />
                        </div>
                        <p>No tasks found. Your plate is clean!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tasks.map((item) => (
                    <tr key={item.id || item._id}>
                      <td>{item.title || item.name}</td>
                      <td>
                        <span className={`status_badge ${item.status}`}>
                          {item.status === "completed"
                            ? "Completed"
                            : item.status === "in_progress"
                              ? "In Progress"
                              : "Pending"}
                        </span>
                      </td>
                      <td>
                        <span className={`priority_badge ${item.priority}`}>
                          {item.priority === "high"
                            ? "High"
                            : item.priority === "medium"
                              ? "Medium"
                              : "Low"}
                        </span>
                      </td>
                      <td>
                        {item.dueDate
                          ? new Date(item.dueDate).toLocaleDateString()
                          : item.due || "No date"}
                      </td>
                      <td>
                        <div className="action_buttons">
                          <button
                            className="complete_btn"
                            onClick={() =>
                              handleStatusChange(
                                item.id || item._id,
                                item.status,
                              )
                            }
                          >
                            <IoCheckmarkOutline />
                          </button>
                          <button
                            className="delete_btn"
                            onClick={() =>
                              handleDeleteTask(item.id || item._id)
                            }
                          >
                            <IoTrashOutline />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showCreateModal && (
          <div
            className="modal_overlay"
            onClick={() => !isLoading && setShowCreateModal(false)}
          >
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
              <div className="modal_header">
                <h3>Create New Task</h3>
                <button
                  className="close_btn"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isLoading}
                >
                  <IoCloseOutline />
                </button>
              </div>
              <form onSubmit={handleCreateTask}>
                <div className="form_group">
                  <label>Task Name</label>
                  <input
                    type="text"
                    placeholder="Enter task name"
                    onChange={handleInputChange}
                    value={createTaskData.title}
                    disabled={isLoading}
                    name="title"
                    required
                  />
                </div>
                <div className="form_group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    placeholder="Enter task description"
                    value={createTaskData.description}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    name="description"
                  />
                </div>
                <div className="form_row">
                  <div className="form_group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={createTaskData.priority}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="form_group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={createTaskData.status}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="form_group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={createTaskData.dueDate}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="modal_actions">
                  <button
                    type="button"
                    className="cancel_btn"
                    onClick={() => setShowCreateModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit_btn"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
