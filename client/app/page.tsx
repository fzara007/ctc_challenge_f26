'use client';
import { getRestaurants, getVisits, createRestaurant, createVisit } from '@/lib/apiClient';
import type { Restaurant, Visit } from '@/lib/types';
import { TabButton } from '@/components/TabButton';
import { RestaurantsTab } from '@/components/RestaurantsTab';
import { VisitsTab } from '@/components/VisitsTab';
import { BudgetTab } from '@/components/BudgetTab';
import { useState, useEffect } from 'react';

type Tab = 'restaurants' | 'visits' | 'budget';

// Server component. Fetches restaurants on each request and renders a plain
// list. There is no loading state, no empty state, and no error handling: if
// the API is down or returns something unexpected, this throws.
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('restaurants');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [restaurantData, visitData] = await Promise.all([
        getRestaurants(),
        getVisits(),
      ]);
      setRestaurants(restaurantData);
      setVisits(visitData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <p className="text-stone-500">Loading...</p>;
  }

  return (
    <div>
      <div className="mb-8 flex gap-2 rounded-full bg-white p-1.5 shadow-sm w-fit">
      <TabButton label="Restaurants" active={activeTab === 'restaurants'} onClick={() => setActiveTab('restaurants')} />
      <TabButton label="Visit Log" active={activeTab === 'visits'} onClick={() => setActiveTab('visits')} />
      <TabButton label="Budget" active={activeTab === 'budget'} onClick={() => setActiveTab('budget')} />
    </div>

      {activeTab === 'restaurants' && (
        <RestaurantsTab
          restaurants={restaurants}
          visits={visits}
          onRestaurantCreated={(r) => setRestaurants((prev) => [r, ...prev])}
        />
      )}
      {activeTab === 'visits' && (
        <VisitsTab
          visits={visits}
          restaurants={restaurants}
          onVisitCreated={(v) => setVisits((prev) => [v, ...prev])}
        />
      )}
      {activeTab === 'budget' && <BudgetTab restaurants={restaurants} visits={visits} />}
    </div>
  );
}
