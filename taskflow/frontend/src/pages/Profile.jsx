import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { updateProfile } from "../store/authSlice";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { full_name: user?.full_name || "", email: user?.email || "" },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await dispatch(updateProfile(data));
    setSubmitting(false);
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
    } else {
      toast.error(result.payload || "Failed to update profile");
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Profile</h1>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Full Name"
            name="full_name"
            register={register}
            error={errors.full_name}
            {...register("full_name", { required: "Full name is required" })}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
