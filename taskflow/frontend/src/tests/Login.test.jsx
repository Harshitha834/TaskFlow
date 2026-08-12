import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../store/authSlice";
import projectReducer from "../store/projectSlice";
import taskReducer from "../store/taskSlice";
import Login from "../pages/Login";

vi.mock("../services/api", () => ({
  default: { post: vi.fn(() => Promise.resolve({ data: {} })) },
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

describe("Login page", () => {
  it("renders email and password fields", () => {
    renderWithProviders(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    renderWithProviders(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
