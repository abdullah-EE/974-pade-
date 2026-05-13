const cooldowns = new Map<string, number>();

export function canRunAction(key: string, cooldownMs = 1200) {
  const now = Date.now();
  const previous = cooldowns.get(key) || 0;
  if (now - previous < cooldownMs) return false;
  cooldowns.set(key, now);
  return true;
}
