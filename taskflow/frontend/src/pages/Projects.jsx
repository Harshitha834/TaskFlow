import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { fetchProjects } from "../store/projectSlice";
import ProjectCard from "../components/ProjectCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

export default function Projects() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.projects);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(fetchProjects(search));
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, dispatch]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <Link to="/projects/new">
          <Button>
            <FiPlus size={16} /> New Project
          </Button>
        </Link>
      </div>

      <div className="mb-6 relative max-w-sm">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="input pl-9"
        />
      </div>

      {status === "loading" ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Create a project to start organizing your tasks."
          action={
            <Link to="/projects/new">
              <Button>Create your first project</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
