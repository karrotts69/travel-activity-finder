import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || '';

app.use(cors());
app.use(express.json());

interface CitySuggestion {
  city: string;
  country: string;
  lon: number;
  lat: number;
}

interface Activity {
  title: string;
  description: string;
  price: number;
  duration: string;
  type: string;
  imageUrl: string;
  rating?: number;
  groupSize?: string;
}

app.get('/api/city-suggestions', async (req, res) => {
  const { query } = req.query as { query?: string };
  if (!query || query.length < 3) {
    return res.json([]);
  }

  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=city&limit=5&apiKey=${GEOAPIFY_API_KEY}`
    );
    const suggestions: CitySuggestion[] = response.data.features.map((feature: any) => ({
      city: feature.properties.city || feature.properties.name,
      country: feature.properties.country,
      lon: feature.properties.lon,
      lat: feature.properties.lat,
    }));
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch city suggestions' });
  }
});

app.get('/api/activities', async (req, res) => {
  const { city, country, startDate, endDate, budget } = req.query as {
    city?: string;
    country?: string;
    startDate?: string;
    endDate?: string;
    budget?: string;
  };
  if (!city || !country || !startDate || !endDate || !budget) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const searchQuery = `${city}, ${country}`;
    const geocodeResponse = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchQuery)}&type=city&apiKey=${GEOAPIFY_API_KEY}`
    );
    if (!geocodeResponse.data.features.length) {
      return res.status(404).json({ error: 'City not found' });
    }
    const { lon, lat } = geocodeResponse.data.features[0].properties;

    const placesResponse = await axios.get(
      `https://api.geoapify.com/v2/places?categories=tourism,entertainment,leisure&filter=circle:${lon},${lat},10000&limit=20&apiKey=${GEOAPIFY_API_KEY}`
    );

    const budgetNum = Number(budget);
    const activities: Activity[] = (placesResponse.data.features || []).map((place: any) => {
      const type = place.properties.categories?.[0]?.split('.')[0] || 'tourism';
      const price =
        type === 'leisure' && place.properties.name?.toLowerCase().includes('park')
          ? 0 // Free for parks
          : Math.min(Math.floor(Math.random() * 50) + 10, budgetNum); // Cap at budget
      return {
        title: place.properties.name || 'Local Attraction',
        description: place.properties.categories?.join(', ') || 'Explore this spot!',
        price,
        duration: '1-2 hours',
        type,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
        rating: 4.0 + Math.random() * 1,
        groupSize: 'Any',
      };
    }).filter((activity: Activity) => activity.price <= budgetNum);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});