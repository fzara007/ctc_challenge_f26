'use client';

import { useState } from 'react';
import { createRestaurant } from '@/lib/apiClient';
import { computeStats } from '@/lib/stats';
import type { Restaurant, Visit } from '@/lib/types';
import { lacquer } from '@/lib/fonts';

export function RestaurantsTab({
  restaurants,
  visits,
  onRestaurantCreated,
}: {
  restaurants: Restaurant[];
  visits: Visit[];
  onRestaurantCreated: (r: Restaurant) => void;
}) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div>
      <AddRestaurantForm onCreated={onRestaurantCreated} />

      <h2 className={`${lacquer.className} mb-4 mt-8 text-lg text-stone-900`}>restaurants</h2>
      <ul className="space-y-3">
        {restaurants.map((restaurant) => {
          const isExpanded = expandedId === restaurant.id;
          const stats = computeStats(restaurant.id, visits);

          return (
            <li
              key={restaurant.id}
              onClick={() => setExpandedId(isExpanded ? null : restaurant.id)}
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-stone-900">{restaurant.name}</span>
                <span className={`${lacquer.className} text-sm text-brand-600`}>{restaurant.rating}★</span>
              </div>
              <div className="mt-1 text-sm text-stone-500">
                {restaurant.cuisine} · {restaurant.address}
              </div>

              {isExpanded && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-brand-100 pt-3 text-sm text-stone-700">
                  <div>Total visits: {stats.totalVisits}</div>
                  <div className="text-rose-600 font-medium">Total spent: ${stats.totalSpend.toFixed(2)}</div>
                  <div className="text-rose-600 font-medium">Average spent: ${stats.averageSpent.toFixed(2)}</div>
                  <div>Last visited: {stats.lastVisited ?? 'Never'}</div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AddRestaurantForm({ onCreated }: { onCreated: (r: Restaurant) => void }) {
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const created = await createRestaurant({
        name,
        cuisine: cuisine || null,
        address: address || null,
        rating: Number(rating),
      });
      onCreated(created);
      setName('');
      setCuisine('');
      setAddress('');
      setRating('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className={`${lacquer.className} mb-3 text-base text-stone-900`}>Add a restaurant</h3>
      <div className="grid grid-cols-2 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="rounded border border-stone-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
        <input
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          placeholder="Cuisine"
          className="rounded border border-stone-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="rounded border border-stone-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
        <input
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Rating (0-5)"
          type="number"
          step="0.1"
          min="0"
          max="5"
          required
          className="rounded border border-stone-300 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className={`${lacquer.className} mt-3 rounded bg-brand-500 px-4 py-2 text-sm text-white hover:bg-brand-600 disabled:opacity-50`}
      >
        {submitting ? 'Adding...' : 'Add restaurant'}
      </button>
    </form>
  );
}