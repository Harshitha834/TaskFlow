import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

import { fetchProjectById, updateProject, clearCurrentProject } from "../store/projectSlice";
import ProjectForm from "../components/ProjectForm";
import Card from "../components/Card";
import Loader from "../components/Loader";

export default function EditProject() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const project = useSelector((state) => state.projects.current);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchProjectById(id)).finally(() => setLoading(false));
    return () => dispatch(clearCurrentProject());
  }, [dispatch, id]);

  if (loading || !project) return <Loader label="Loading project..." />;

  const defaultValues = {
    title: project.title,
    description: project.description || "",
    deadline: project.deadline ? project.deadline.slice(0, 10) : "",
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const payload = {
      ...data,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
    };
    const result = await dispatch(updateProject({ id, payload }));
    setSubmitting(false);
    if (updateProject.fulfilled.match(result)) {
      toast.success("Project updated");
      navigate(`/projects/${id}`);
    } else {
      toast.error(result.payload || "Failed to update project");
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <Link to={`/projects/${id}`} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <FiArrowLeft size={15} /> Back to project
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Edit Project</h1>
      <Card>
        <ProjectForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          submitting={submitting}
          submitLabel="Save Changes"
        />
      </Card>
    </div>
  );
}
