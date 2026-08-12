import { NavLink } from "react-router-dom";
import { FiGrid, FiFolder, FiCheckSquare, FiUser } from "react-icons/fi";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/projects", label: "Projects", icon: FiFolder },
  { to: "/tasks", label: "Tasks", icon: FiCheckSquare },
  { to: "/profile", label: "Profile", icon: FiUser },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-100 bg-white md:block">
      <nav className="flex flex-col gap-1 p-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
