import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Input from "./Input";
import Button from "./Button";

export default function TaskForm({ defaultValues, onSubmit, submitting, submitLabel = "Save Task", lockProject = false }) {
  const projects = useSelector((state) => state.projects.items);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      title: "",
      description: "",
      priority: "Medium",
      status: "Pending",
      due_date: "",
      project_id: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Task Title"
        name="title"
        placeholder="e.g. Design landing page"
        register={register}
        error={errors.title}
        {...register("title", { required: "Task title is required" })}
      />

      <div className="mb-4">
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Add more detail about this task"
          className="input"
          {...register("description")}
        />
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="project_id">
          Project
        </label>
        <select
          id="project_id"
          disabled={lockProject}
          className="input"
          {...register("project_id", { required: "Please select a project" })}
        >
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        {errors.project_id && (
          <p className="mt-1 text-xs text-red-600">{errors.project_id.message}</p>
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="priority">
            Priority
          </label>
          <select id="priority" className="input" {...register("priority")}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="status">
            Status
          </label>
          <select id="status" className="input" {...register("status")}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <Input label="Due Date" name="due_date" type="date" register={register} error={errors.due_date} />

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
