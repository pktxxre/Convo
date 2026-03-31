interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={[
          'w-full px-4 py-3 rounded-xl border text-base',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-500',
          'placeholder:text-gray-400',
          error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
