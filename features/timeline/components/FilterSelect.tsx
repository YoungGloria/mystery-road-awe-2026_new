type FilterOption = { value: string; label: string };

type FilterSelectProps = {
  id: string;
  label: string;
  allLabel: string;
  defaultValue: string;
  options: FilterOption[];
};

export function FilterSelect({
  id,
  label,
  allLabel,
  defaultValue,
  options,
}: FilterSelectProps) {
  return (
    <>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <select id={id} defaultValue={defaultValue}>
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
