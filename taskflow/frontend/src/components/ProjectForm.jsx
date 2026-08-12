import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";

export default function ProjectForm({ defaultValues, onSubmit, submitting, submitLabel = "Save Project" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || { title: "", description: "", deadline: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Project Title"
        name="title"
        placeholder="e.g. Website Redesign"
        register={register}
        error={errors.title}
        {...register("title", { required: "Project title is required" })}
      />

      <div className="mb-4">
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="What is this project about?"
          className="input"
          {...register("description")}
        />
      </div>

      <Input
        label="Deadline"
        name="deadline"
        type="date"
        register={register}
        error={errors.deadline}
      />

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
