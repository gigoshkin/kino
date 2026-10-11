import { CheckboxCheckedIcon } from './icons';

export default function Checkbox({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {checked ? (
        <CheckboxCheckedIcon className="shrink-0 text-red" />
      ) : (
        <span className="size-4.5 shrink-0 rounded-[5px] border-[1.5px] border-disabled" />
      )}
      <span className="flex items-center gap-1.25 text-label font-semibold">
        {label}
        {hint && <span className="text-body-s font-normal text-muted">· {hint}</span>}
      </span>
    </label>
  );
}
