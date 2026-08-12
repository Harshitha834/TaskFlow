import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

import { fetchTaskById, updateTask, clearCurrentTask } from "../store/taskSlice";
import { fetchProjects } from "../store/projectSlice";
import TaskForm from "../components/TaskForm";
import Card from "../components/Card";
import Loader from "../components/Loader";

export default function EditTask() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const task = useSelector((state) => state.tasks.current);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTaskById(id)).finally(() => setLoading(false));
    return () => dispatch(clearCurrentTask());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  if (loading || !task) return <Loader label="Loading task..." />;

  const defaultValues = {
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    status: task.status,
    due_date: task.due_date ? task.due_date.slice(0, 10) : "",
    project_id: task.project_id,
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const payload = {
      ...data,
      project_id: Number(data.project_id),
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
    };
    const result = await dispatch(updateTask({ id, payload }));
    setSubmitting(false);
    if (updateTask.fulfilled.match(result)) {
      toast.success("Task updated");
      navigate(`/projects/${payload.project_id}`);
    } else {
      toast.error(result.payload || "Failed to update task");
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Link to="/tasks" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <FiArrowLeft size={15} /> Back to tasks
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Edit Task</h1>
      <Card>
        <TaskForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          submitting={submitting}
          submitLabel="Save Changes"
        />
      </Card>
    </div>
  );
}
