export const InputField = ({
  label,
  name,
  type = "text",
  register,
  error,
  validation,
  placeholder,
  value,
}) => {
  const inputProps = {
    type,
    id: name,
    name,
    placeholder,
    ...register(name, validation),
    className:
      "border border-border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-logo placeholder:text-sm bg-bg-input",
  };

  if (value !== undefined) {
    inputProps.value = value;
  }

  return (
    <div className="flex flex-col w-full my-2">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium mb-1 text-gray-muted"
        >
          {label}
        </label>
      )}
      <input {...inputProps} />
      {error && <small className="text-red-logo mt-1">{error}</small>}
    </div>
  );
};
