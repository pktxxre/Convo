interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_STYLES = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50',
  ghost: 'text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 disabled:opacity-50',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 disabled:opacity-50',
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-5 py-3 text-base rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  fullWidth,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'font-semibold transition-colors flex items-center justify-center gap-2',
        'disabled:cursor-not-allowed',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
