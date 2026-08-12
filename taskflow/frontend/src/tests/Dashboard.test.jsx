import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../store/authSlice";
import projectReducer from "../store/projectSlice";
import taskReducer from "../store/taskSlice";
import Dashboard from "../pages/Dashboard";

vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          total_projects: 3,
          total_tasks: 10,
          pending_tasks: 4,
          in_progress_tasks: 2,
          completed_tasks: 5,
          overdue_tasks: 1,
          recent_tasks: [],
          upcoming_deadlines: [],
        },
      })
    ),
  },
  getErrorMessage: () => "error",
}));

function renderWithProviders(ui) {
  const store = configureStore({
    reducer: { auth: authReducer, projects: projectReducer, tasks: taskReducer },
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
}

describe("Dashboard page", () => {
  it("renders stats after loading", async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("Total Projects")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });
});
