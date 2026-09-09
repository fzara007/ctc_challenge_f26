import { monthLabel, monthKey } from '@/lib/stats';
import type { Restaurant, Visit } from '@/lib/types';
import { lacquer } from '@/lib/fonts';

export function BudgetTab({ restaurants, visits }: { restaurants: Restaurant[]; visits: Visit[] }) {
  const restaurantsById = Object.fromEntries(restaurants.map((r) => [r.id, r]));

  const visitsByMonth: Record<string, Visit[]> = {};
  for (const visit of visits) {
    const key = monthKey(visit.date);
    if (!visitsByMonth[key]) visitsByMonth[key] = [];
    visitsByMonth[key].push(visit);
  }

  const sortedMonthKeys = Object.keys(visitsByMonth).sort((a, b) => (a < b ? 1 : -1));
  const grandTotal = visits.reduce((sum, v) => sum + (v.amountSpent ?? 0), 0);

  return (
    <div>
      <h2 className={`${lacquer.className} mb-4 text-lg text-stone-900`}>Budget</h2>
      <p className="mb-6 text-sm text-stone-600">
        Total spent across all time:{' '}
        <span className={`${lacquer.className} text-rose-600`}>${grandTotal.toFixed(2)}</span>
      </p>

      <div className="space-y-8">
        {sortedMonthKeys.map((key) => {
          const monthVisits = [...visitsByMonth[key]].sort((a, b) => (a.date < b.date ? 1 : -1));
          const monthTotal = monthVisits.reduce((sum, v) => sum + (v.amountSpent ?? 0), 0);

          return (
            <div key={key}>
              <h3 className={`${lacquer.className} mb-2 text-base text-stone-900`}>{monthLabel(key)}</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-brand-50 text-left text-stone-600">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Restaurant</th>
                      <th className="px-4 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthVisits.map((visit) => {
                      const restaurant = restaurantsById[visit.restaurantId];
                      return (
                        <tr key={visit.id} className="border-t border-brand-100">
                          <td className="px-4 py-2">{visit.date}</td>
                          <td className="px-4 py-2">
                            {restaurant ? restaurant.name : `Restaurant #${visit.restaurantId}`}
                          </td>
                          <td className="px-4 py-2 font-medium text-rose-600">
                            {visit.amountSpent !== null ? `$${visit.amountSpent.toFixed(2)}` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="border-t-2 border-brand-200 bg-brand-50 font-medium text-stone-900">
                    <tr>
                      <td className="px-4 py-2" colSpan={2}>
                        Month total
                      </td>
                      <td className="px-4 py-2">${monthTotal.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}

        {sortedMonthKeys.length === 0 && <p className="text-gray-500">No visits logged yet.</p>}
      </div>
    </div>
  );
}