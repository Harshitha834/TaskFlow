import { Link } from "react-router-dom";
import { FiCalendar, FiCheckSquare } from "react-icons/fi";

function formatDate(dateStr) {
  if (!dateStr) return "No deadline";
  return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ProjectCard({ project }) {
  const taskCount = project.tasks ? project.tasks.length : project.task_count || 0;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="card block transition-shadow hover:shadow-md"
    >
      <h3 className="mb-1 truncate text-base font-semibold text-gray-800">{project.title}</h3>
      <p className="mb-4 line-clamp-2 text-sm text-gray-500">
        {project.description || "No description provided."}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <FiCalendar size={14} /> {formatDate(project.deadline)}
        </span>
        <span className="flex items-center gap-1">
          <FiCheckSquare size={14} /> {taskCount} task{taskCount === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}
