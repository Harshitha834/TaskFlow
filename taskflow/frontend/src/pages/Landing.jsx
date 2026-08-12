import { Link } from "react-router-dom";
import { FiCheckCircle, FiFolder, FiTrendingUp } from "react-icons/fi";

const features = [
  {
    icon: FiFolder,
    title: "Organize projects",
    description: "Group related work into projects with clear deadlines and ownership.",
  },
  {
    icon: FiCheckCircle,
    title: "Track every task",
    description: "Break projects into tasks with priorities, statuses, and due dates.",
  },
  {
    icon: FiTrendingUp,
    title: "See your progress",
    description: "A live dashboard shows what's pending, overdue, or done at a glance.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-xl font-bold text-primary-700">TaskFlow</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn btn-secondary">
            Log in
          </Link>
          <Link to="/register" className="btn btn-primary">
            Sign up free
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Plan projects. Track tasks. <span className="text-primary-600">Ship on time.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600">
          TaskFlow is a simple, focused way for teams and individuals to manage projects and
          tasks from kickoff to completion.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register" className="btn btn-primary px-6 py-3 text-base">
            Get started — it's free
          </Link>
          <Link to="/login" className="btn btn-secondary px-6 py-3 text-base">
            I have an account
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl grid gap-6 px-6 pb-24 sm:grid-cols-3 sm:px-10">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="card text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Icon size={20} />
            </div>
            <h3 className="mb-1 text-base font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
