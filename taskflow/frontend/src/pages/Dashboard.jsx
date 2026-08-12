import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiFolder, FiCheckSquare, FiClock, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";

import api, { getErrorMessage } from "../services/api";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { PriorityBadge, StatusBadge } from "../components/Badges";

const statCards = [
  { key: "total_projects", label: "Total Projects", icon: FiFolder, color: "text-primary-600 bg-primary-50" },
  { key: "total_tasks", label: "Total Tasks", icon: FiCheckSquare, color: "text-blue-600 bg-blue-50" },
  { key: "pending_tasks", label: "Pending Tasks", icon: FiClock, color: "text-amber-600 bg-amber-50" },
  { key: "completed_tasks", label: "Completed Tasks", icon: FiCheckCircle, color: "text-green-600 bg-green-50" },
  { key: "overdue_tasks", label: "Overdue Tasks", icon: FiAlertTriangle, color: "text-red-600 bg-red-50" },
];

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/dashboard");
        setData(response.data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load dashboard"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (!data) return <EmptyState title="Couldn't load dashboard" />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="card">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{data[key]}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          {data.recent_tasks.length === 0 ? (
            <EmptyState title="No tasks yet" description="Create your first task to see it here." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.recent_tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-400">Due {formatDate(task.due_date)}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">Upcoming Deadlines</h2>
            <Link to="/tasks" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          {data.upcoming_deadlines.length === 0 ? (
            <EmptyState title="No upcoming deadlines" description="Tasks with due dates will show up here." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {data.upcoming_deadlines.map((task) => (
                <li key={task.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">{task.title}</p>
                    <p className="text-xs text-gray-400">Due {formatDate(task.due_date)}</p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
