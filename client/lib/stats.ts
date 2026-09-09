import type { Visit } from './types';

export function computeStats(restaurantId: number, visits: Visit[]) {
  const matches = visits.filter((v) => v.restaurantId === restaurantId);
  const totalVisits = matches.length;
  const totalSpend = matches.reduce((sum, v) => sum + (v.amountSpent ?? 0), 0);
  const averageSpent = totalVisits > 0 ? totalSpend / totalVisits : 0;
  const lastVisited =
    totalVisits > 0
      ? matches.reduce((latest, v) => (v.date > latest ? v.date : latest), matches[0].date)
      : null;

  return { totalVisits, totalSpend, averageSpent, lastVisited };
}

export function monthLabel(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}