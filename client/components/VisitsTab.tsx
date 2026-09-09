'use client';

import { useState } from 'react';
import { createVisit } from '@/lib/apiClient';
import type { Restaurant, Visit } from '@/lib/types';
import { lacquer } from '@/lib/fonts';

export function VisitsTab({
  visits,
  restaurants,
  onVisitCreated,
}: {
  visits: Visit[];
  restaurants: Restaurant[];
  onVisitCreated: (v: Visit) => void;
}) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const restaurantsById = Object.fromEntries(restaurants.map((r) => [r.id, r]));
  const sortedVisits = [...visits].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <LogVisitForm restaurants={restaurants} onCreated={onVisitCreated} />

      <h2 className={`${lacquer.className} mb-4 mt-8 text-lg text-stone-900`}>Visit Log</h2>
      <ul className="space-y-3">
        {sortedVisits.map((visit) => {
          const isExpanded = expandedId === visit.id;
          const restaurant = restaurantsById[visit.restaurantId];

          return (
            <li
              key={visit.id}
              onClick={() => setExpandedId(isExpanded ? null : visit.id)}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-stone-900">
                  {restaurant ? restaurant.name : `Restaurant #${visit.restaurantId}`}
                </span>
                <span className="text-sm font-medium text-rose-600">
                  {visit.amountSpent !== null ? `$${visit.amountSpent.toFixed(2)}` : '—'}
                </span>
              </div>
              <div className="mt-1 text-sm text-stone-500">{visit.date}</div>

              {isExpanded && (
                <div className="mt-3 border-t border-brand-100 pt-3 text-sm text-stone-700">
                  {visit.notes || 'No notes.'}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LogVisitForm({
  restaurants,
  onCreated,
}: {
  restaurants: Restaurant[];
  onCreated: (v: Visit) => void;
}) {
  const [restaurantId, setRestaurantId] = useState('');
  const [date, setDate] = useState('');
  const [amountSpent, setAmountSpent] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const created = await createVisit({
        restaurantId: Number(restaurantId),
        date,
        amountSpent: amountSpent ? Number(amountSpent) : null,
        notes: notes || null,
      });
      onCreated(created);
      setRestaurantId('');
      setDate('');
      setAmountSpent('');
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className={`${lacquer.className} mb-3 text-base text-stone-900`}>Log a visit</h3>
      <div className="grid grid-cols-2 gap-3">
        <select
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          required
          className="rounded border border-stone-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
        >
          <option value="" disabled>
            Select a restaurant
          </option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
          required
          className="rounded border border-stone-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
        <input
          value={amountSpent}
          onChange={(e) => setAmountSpent(e.target.value)}
          placeholder="Amount spent"
          type="number"
          step="0.01"
          min="0"
          className="rounded border border-stone-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="rounded border border-stone-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className={`${lacquer.className} mt-3 rounded bg-brand-500 px-4 py-2 text-sm text-white hover:bg-brand-600 disabled:opacity-50`}
      >
        {submitting ? 'Logging...' : 'Log visit'}
      </button>
    </form>
  );
}