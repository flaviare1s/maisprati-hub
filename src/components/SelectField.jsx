export const SelectField = ({
  label,
  name,
  options = [],
  register,
  error,
  required = false,
}) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-muted mb-2">
        {label} {required && <span>*</span>}
      </label>
      <select
        id={name}
        {...register(name, { required: required && `${label} é obrigatório` })}
        className={`w-full px-3 py-2 border-2 rounded-lg transition-colors duration-200 bg-blue-logo text-light font-bold`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-primary">
          {error.message}
        </p>
      )}
    </div>
  );
};
