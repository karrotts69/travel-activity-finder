import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://travel-activity-finder-backend.onrender.com';

const App: React.FC = () => {
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, budget, startDate, endDate }),
      });
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Travel Activity Finder</h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-2">
            <MapPin size={20} />
            <input
              type="text"
              placeholder="Enter city or town"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={20} />
            <input
              type="number"
              placeholder="Budget ($)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Search Activities
        </button>
        {loading && <p className="mt-4 text-center">Loading...</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        {activities.length > 0 && (
          <ul className="mt-6 space-y-4">
            {activities.map((activity, index) => (
              <li key={index} className="p-4 bg-gray-50 rounded shadow">
                <h3 className="font-semibold">{activity.title}</h3>
                <p>{activity.description}</p>
                <p>Cost: ${activity.price}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;