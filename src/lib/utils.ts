export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const AVATAR_COLORS = [
  'bg-red-400',
  'bg-orange-400',
  'bg-amber-400',
  'bg-lime-500',
  'bg-green-400',
  'bg-emerald-400',
  'bg-teal-400',
  'bg-cyan-400',
  'bg-sky-400',
  'bg-blue-400',
  'bg-indigo-400',
  'bg-violet-400',
  'bg-purple-400',
  'bg-fuchsia-400',
  'bg-pink-400',
  'bg-rose-400',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// Stable pseudo-random member count (80–699) from major name
export function majorMemberCount(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = Math.imul(31, h) + name.charCodeAt(i) | 0;
  return 80 + (Math.abs(h) % 620);
}

// Active users = roughly 4–12% of members, seeded differently so it varies independently
export function majorActiveUsers(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = Math.imul(17, h) + name.charCodeAt(i) | 0;
  const members = majorMemberCount(name);
  return Math.max(1, Math.round(members * (0.04 + (Math.abs(h) % 9) / 100)));
}

export function majorSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
