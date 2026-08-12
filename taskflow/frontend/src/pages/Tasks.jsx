import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

import { fetchTasks, updateTask, deleteTask } from "../store/taskSlice";
import { fetchProjects } from "../store/projectSlice";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import Modal from "../components/Modal";

export default function Tasks() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.tasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(
        fetchTasks({
          search: search || undefined,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          sort_by: sortBy,
        })
      );
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, statusFilter, priorityFilter, sortBy, dispatch]);

  const handleMarkComplete = async (task) => {
    const result = await dispatch(updateTask({ id: task.id, payload: { status: "Completed" } }));
    if (updateTask.fulfilled.match(result)) {
      toast.success("Task marked as complete");
    } else {
      toast.error(result.payload || "Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    const result = await dispatch(deleteTask(taskToDelete.id));
    if (deleteTask.fulfilled.match(result)) {
      toast.success("Task deleted");
    } else {
      toast.error(result.payload || "Failed to delete task");
    }
    setTaskToDelete(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <Link to="/tasks/new">
          <Button>
            <FiPlus size={16} /> New Task
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="input pl-9"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-auto">
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="input w-auto">
          <option value="">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input w-auto">
          <option value="created_at">Sort: Newest</option>
          <option value="due_date">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
        </select>
      </div>

      {status === "loading" ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Create a task or adjust your filters."
          action={
            <Link to="/tasks/new">
              <Button>Create a task</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMarkComplete={handleMarkComplete}
              onDelete={(t) => setTaskToDelete(t)}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Delete task?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTaskToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteTask}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          This will permanently delete "{taskToDelete?.title}". This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
