import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";

import { logout } from "../store/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-6">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-primary-700">TaskFlow</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-gray-600 sm:inline">
          Hi, <span className="font-medium text-gray-800">{user?.full_name || "there"}</span>
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
