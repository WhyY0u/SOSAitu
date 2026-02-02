export function formatTicketDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const time = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return `Сегодня в ${time}`;
  }

  const sameYear = date.getFullYear() === now.getFullYear();

  const datePart = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });

  if (sameYear) {
    return `${datePart} в ${time}`;
  }

  return `${datePart} ${date.getFullYear()} г. в ${time}`;
}
