import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

import { createTask } from "../store/taskSlice";
import { fetchProjects } from "../store/projectSlice";
import TaskForm from "../components/TaskForm";
import Card from "../components/Card";

export default function CreateTask() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedProjectId = searchParams.get("project_id");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const payload = {
      ...data,
      project_id: Number(data.project_id),
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
    };
    const result = await dispatch(createTask(payload));
    setSubmitting(false);
    if (createTask.fulfilled.match(result)) {
      toast.success("Task created");
      navigate(`/projects/${payload.project_id}`);
    } else {
      toast.error(result.payload || "Failed to create task");
    }
  };

  const defaultValues = {
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    due_date: "",
    project_id: preselectedProjectId || "",
  };

  return (
    <div className="mx-auto max-w-lg">
      <Link to="/tasks" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <FiArrowLeft size={15} /> Back to tasks
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">New Task</h1>
      <Card>
        <TaskForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          submitting={submitting}
          submitLabel="Create Task"
          lockProject={!!preselectedProjectId}
        />
      </Card>
    </div>
  );
}
