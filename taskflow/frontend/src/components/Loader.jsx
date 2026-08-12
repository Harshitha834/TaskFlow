import Spinner from "./Spinner";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Spinner size="h-8 w-8" />
      <p className="mt-3 text-sm">{label}</p>
    </div>
  );
}
