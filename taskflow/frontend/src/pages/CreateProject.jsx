import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

import { createProject } from "../store/projectSlice";
import ProjectForm from "../components/ProjectForm";
import Card from "../components/Card";

export default function CreateProject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const payload = {
      ...data,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
    };
    const result = await dispatch(createProject(payload));
    setSubmitting(false);
    if (createProject.fulfilled.match(result)) {
      toast.success("Project created");
      navigate(`/projects/${result.payload.id}`);
    } else {
      toast.error(result.payload || "Failed to create project");
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Link to="/projects" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <FiArrowLeft size={15} /> Back to projects
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">New Project</h1>
      <Card>
        <ProjectForm onSubmit={onSubmit} submitting={submitting} submitLabel="Create Project" />
      </Card>
    </div>
  );
}
