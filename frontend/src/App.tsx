import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, Compass, Clock, Tag, Users, Star } from 'lucide-react';
import { Activity, CitySuggestion } from './types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getCitySuggestions = async (query: string): Promise<CitySuggestion[]> => {
  if (!query || query.length < 3) return [];
  try {
    const response = await fetch(`${BACKEND_URL}/api/city-suggestions?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`City suggestions failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    return [];
  }
};

const getActivities = async (city: string, country: string, startDate: string, endDate: string, budget: number): Promise<Activity[]> => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/activities?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&budget=${budget}`
    );
    if (!response.ok) throw new Error(`Activities fetch failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

const App: React.FC = () => {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      const suggestions = await getCitySuggestions(city);
      setCitySuggestions(suggestions);
    };
    fetchSuggestions();
  }, [city]);

  const handleCitySelect = (suggestion: CitySuggestion) => {
    setCity(suggestion.city);
    setCountry(suggestion.country);
    setCitySuggestions([]);
  };

  const handleSearch = async () => {
    console.log({ city, country, startDate, endDate, budget });
    if (!city || !country || !startDate || !endDate || !budget) {
      setError('Please fill in all fields');
      return;
    }
    const budgetNum = Number(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setError('Budget must be a positive number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const recommendedActivities = await getActivities(city, country, startDate, endDate, budgetNum);
      setActivities(recommendedActivities);
      setSearched(true);
    } catch (err) {
      setError('Failed to fetch activities. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Travel Activity Finder</h1>
          <p className="text-gray-600">Discover amazing activities for your trip</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter city name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {citySuggestions.length > 0 && (
                <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {citySuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-indigo-100 cursor-pointer text-gray-800"
                      onClick={() => handleCitySelect(suggestion)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {suggestion.city}, {suggestion.country}
                    </li>
                  ))}
                </ul>
              )}
              {country && <p className="text-sm text-gray-500 mt-1">Country: {country}</p>}
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="number"
                placeholder="Budget per activity"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="mt-4 text-red-600 text-center">{error}</div>}

          <button
            onClick={handleSearch}
            disabled={loading}
            className={`w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Compass size={20} />
            {loading ? 'Searching...' : 'Find Activities'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
            </svg>
            <p className="mt-2 text-gray-600">Loading activities...</p>
          </div>
        )}

        {searched && !loading && (
          <div className="max-w-6xl mx-auto">
            {activities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                    onClick={() => alert(`More Info:\nTitle: ${activity.title}\nDescription: ${activity.description}\nPrice: $${activity.price}\nDuration: ${activity.duration}\nType: ${activity.type}`)}
                  >
                    <div className="relative">
                      <img src={activity.imageUrl} alt={activity.title} className="w-full h-56 object-cover" />
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="text-yellow-400" size={16} fill="currentColor" />
                        <span className="font-semibold">{activity.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-indigo-600 mb-2">
                        <Tag size={16} />
                        <span className="font-medium">{activity.type}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{activity.title}</h3>
                      <p className="text-gray-600 mb-4">{activity.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-gray-400" />
                          <span>${activity.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" />
                          <span>{activity.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-400" />
                          <span>{activity.groupSize}</span>
                        </div>
                      </div>
                      <button
                        className="w-full mt-6 bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <p className="text-gray-600">
                  No activities found for {city}, {country} within your budget of ${budget}.
                  Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;