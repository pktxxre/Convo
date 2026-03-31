import { getAvatarColor, getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const SIZE_STYLES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export default function Avatar({ name, size = 'md' }: AvatarProps) {
  const color = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={[
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0',
        color,
        SIZE_STYLES[size],
      ].join(' ')}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
