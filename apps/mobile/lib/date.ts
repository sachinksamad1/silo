const dayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const shortDayFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
});

export function formatEntryDate(timestamp: number) {
  return dayFormatter.format(new Date(timestamp));
}

export function formatEntryDateShort(timestamp: number) {
  return shortDayFormatter.format(new Date(timestamp));
}

export function formatEntryTime(timestamp: number) {
  return timeFormatter.format(new Date(timestamp));
}

export function formatRelativeSync(timestamp: number | null) {
  if (!timestamp) {
    return 'Not yet synced';
  }

  const deltaMs = Date.now() - timestamp;
  const deltaMinutes = Math.max(0, Math.round(deltaMs / 60000));

  if (deltaMinutes < 1) {
    return 'Just now';
  }

  if (deltaMinutes < 60) {
    return `${deltaMinutes}m ago`;
  }

  const deltaHours = Math.round(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours}h ago`;
  }

  const deltaDays = Math.round(deltaHours / 24);
  return `${deltaDays}d ago`;
}
