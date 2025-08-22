export const InputField = ({
  label,
  name,
  type = "text",
  register,
  error,
  validation,
  placeholder,
  value,
  options,
}) => {
  if (type === "radio" && options) {
    return (
      <div className="flex flex-col w-full my-2">
        {label && (
          <label className="text-sm font-medium mb-2 text-gray-muted">
            {label}
          </label>
        )}
        <div className="flex gap-6">
          {options.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                value={option.value}
                {...register(name, validation)}
                className="mr-2 text-blue-logo focus:ring-blue-logo"
              />
              <span className="text-gray-muted">{option.label}</span>
            </label>
          ))}
        </div>
        {error && <small className="text-red-secondary mt-1">{error}</small>}
      </div>
    );
  }

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
      {error && <small className="text-red-secondary mt-1">{error}</small>}
    </div>
  );
};
