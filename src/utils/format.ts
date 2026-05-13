export function formatGameTime(value: string) {
  const date = new Date(value);
  const now = new Date('2026-05-12T12:00:00+03:00');
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const sameDay = date.toDateString() === now.toDateString();
  const tomorrowDay = date.toDateString() === tomorrow.toDateString();
  const day = sameDay ? 'Tonight' : tomorrowDay ? 'Tomorrow' : date.toLocaleDateString('en-QA', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = date.toLocaleTimeString('en-QA', { hour: 'numeric', minute: '2-digit' });
  return `${day}, ${time}`;
}

export function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function winRate(wins: number, losses: number) {
  return Math.round((wins / Math.max(1, wins + losses)) * 100);
}

export function formatPlayerStatus(status?: 'online' | 'playingTonight' | 'available' | 'recentlyActive' | 'offline') {
  switch (status) {
    case 'online':
      return 'Online';
    case 'playingTonight':
      return 'Playing tonight';
    case 'available':
      return 'Available';
    case 'recentlyActive':
      return 'Recently active';
    case 'offline':
      return 'Offline';
    default:
      return 'Recently active';
  }
}
