export default function Input({ label, error, register, name, type = "text", placeholder, ...rest }) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="label">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={`input ${error ? "border-red-400 focus:ring-red-400" : ""}`}
        {...(register ? register(name) : {})}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}
