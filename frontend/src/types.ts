export interface Activity {
    title: string;
    description: string;
    price: number;
    duration: string;
    type: string;
    imageUrl: string;
    rating?: number;
    groupSize?: string;
  }
  
  export interface CitySuggestion {
    city: string;
    country: string;
    lon: number;
    lat: number;
  }