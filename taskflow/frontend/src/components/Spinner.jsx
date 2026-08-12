export default function Spinner({ size = "h-5 w-5" }) {
  return (
    <div
      className={`${size} animate-spin rounded-full border-2 border-gray-300 border-t-primary-600`}
      role="status"
      aria-label="Loading"
    />
  );
}
