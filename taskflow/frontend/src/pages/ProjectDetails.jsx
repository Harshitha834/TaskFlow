import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

import { fetchProjectById, deleteProject, clearCurrentProject } from "../store/projectSlice";
import { updateTask, deleteTask } from "../store/taskSlice";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import TaskCard from "../components/TaskCard";
import Button from "../components/Button";
import Modal from "../components/Modal";

function formatDate(dateStr) {
  if (!dateStr) return "No deadline";
  return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ProjectDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const project = useSelector((state) => state.projects.current);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const loadProject = () => dispatch(fetchProjectById(id)).finally(() => setLoading(false));

  useEffect(() => {
    loadProject();
    return () => dispatch(clearCurrentProject());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  if (loading || !project) return <Loader label="Loading project..." />;

  const handleDeleteProject = async () => {
    const result = await dispatch(deleteProject(id));
    if (deleteProject.fulfilled.match(result)) {
      toast.success("Project deleted");
      navigate("/projects");
    } else {
      toast.error(result.payload || "Failed to delete project");
    }
    setConfirmDelete(false);
  };

  const handleMarkComplete = async (task) => {
    const result = await dispatch(
      updateTask({ id: task.id, payload: { status: "Completed" } })
    );
    if (updateTask.fulfilled.match(result)) {
      toast.success("Task marked as complete");
      loadProject();
    } else {
      toast.error(result.payload || "Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    const result = await dispatch(deleteTask(taskToDelete.id));
    if (deleteTask.fulfilled.match(result)) {
      toast.success("Task deleted");
      loadProject();
    } else {
      toast.error(result.payload || "Failed to delete task");
    }
    setTaskToDelete(null);
  };

  return (
    <div>
      <Link to="/projects" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <FiArrowLeft size={15} /> Back to projects
      </Link>

      <div className="card mb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-800">{project.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{project.description || "No description provided."}</p>
            <p className="mt-2 text-xs text-gray-400">Deadline: {formatDate(project.deadline)}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Link to={`/projects/${id}/edit`}>
              <Button variant="secondary">
                <FiEdit2 size={15} /> Edit
              </Button>
            </Link>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              <FiTrash2 size={15} /> Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
        <Link to={`/tasks/new?project_id=${id}`}>
          <Button>
            <FiPlus size={16} /> New Task
          </Button>
        </Link>
      </div>

      {project.tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Add a task to start tracking progress on this project."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {project.tasks.map((task) => (
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
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete project?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteProject}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          This will permanently delete "{project.title}" and all of its tasks. This action cannot be undone.
        </p>
      </Modal>

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
