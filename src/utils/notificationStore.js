export const NOTIFICATION_COUNT_KEY = "notification_count";
export const NOTIFICATION_COUNT_EVENT = "notification-count-updated";
export const TASKS_UPDATED_EVENT = "tasks-updated";

export const getStoredNotificationCount = () => {
  if (typeof window === "undefined") return 0;

  try {
    const storedValue = localStorage.getItem(NOTIFICATION_COUNT_KEY);
    if (!storedValue) return 0;

    const parsedValue = Number(storedValue);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  } catch {
    return 0;
  }
};

export const setStoredNotificationCount = (count) => {
  if (typeof window === "undefined") return;

  const safeCount = Math.max(0, Number(count) || 0);
  localStorage.setItem(NOTIFICATION_COUNT_KEY, String(safeCount));
  window.dispatchEvent(new Event(NOTIFICATION_COUNT_EVENT));
};

export const clearStoredNotificationCount = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(NOTIFICATION_COUNT_KEY);
  window.dispatchEvent(new Event(NOTIFICATION_COUNT_EVENT));
};

export const getStoredTasks = () => {
  if (typeof window === "undefined") return [];

  try {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch {
    return [];
  }
};

export const syncStoredTasks = (tasks) => {
  if (typeof window === "undefined") return;

  const normalizedTasks = Array.isArray(tasks) ? tasks : [];
  localStorage.setItem("tasks", JSON.stringify(normalizedTasks));
  window.dispatchEvent(new Event(TASKS_UPDATED_EVENT));
};

export const removeStoredTask = (taskId) => {
  if (typeof window === "undefined") return;

  const tasks = getStoredTasks();
  const filteredTasks = tasks.filter(
    (task) =>
      String(task.id) !== String(taskId) && String(task._id) !== String(taskId),
  );

  localStorage.setItem("tasks", JSON.stringify(filteredTasks));
  window.dispatchEvent(new Event(TASKS_UPDATED_EVENT));
};

export const extractTaskIdFromNotification = (notification) => {
  if (!notification || typeof notification !== "object") return null;

  const candidates = [
    notification.taskId,
    notification.task_id,
    notification.task?.id,
    notification.task?._id,
    notification.data?.taskId,
    notification.data?.task?.id,
    notification.data?.task?._id,
    notification.relatedTask?.id,
    notification.relatedTask?._id,
    notification.id,
  ];

  return (
    candidates.find(
      (value) =>
        value !== null && value !== undefined && String(value).trim() !== "",
    ) ?? null
  );
};
