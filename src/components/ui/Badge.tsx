interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'indigo' | 'green' | 'orange' | 'blue' | 'red';
  size?: 'sm' | 'md';
}

const VARIANT_STYLES = {
  default: 'bg-gray-100 text-gray-600',
  indigo: 'bg-indigo-100 text-indigo-700',
  green: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-orange-100 text-orange-700',
  blue: 'bg-sky-100 text-sky-700',
  red: 'bg-red-100 text-red-600',
};

const SIZE_STYLES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
      ].join(' ')}
    >
      {children}
    </span>
  );
}
