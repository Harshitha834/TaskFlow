import { Link } from "react-router-dom";
import { FiCalendar, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import { PriorityBadge, StatusBadge } from "./Badges";

function formatDate(dateStr) {
  if (!dateStr) return "No due date";
  return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function TaskCard({ task, onDelete, onMarkComplete }) {
  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && task.status !== "Completed";

  return (
    <div className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-gray-800">{task.title}</h3>
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
          {isOverdue && (
            <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
              Overdue
            </span>
          )}
        </div>
        {task.description && (
          <p className="mb-1 line-clamp-1 text-sm text-gray-500">{task.description}</p>
        )}
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <FiCalendar size={13} /> {formatDate(task.due_date)}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {task.status !== "Completed" && onMarkComplete && (
          <button
            onClick={() => onMarkComplete(task)}
            title="Mark complete"
            className="rounded-lg p-2 text-gray-400 hover:bg-green-50 hover:text-green-600"
          >
            <FiCheck size={16} />
          </button>
        )}
        <Link
          to={`/tasks/${task.id}/edit`}
          title="Edit task"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <FiEdit2 size={16} />
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(task)}
            title="Delete task"
            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
