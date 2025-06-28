export interface Property {
  id: number;
  title: string;
  slug: string;
  address: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface User {
  id: number;
  email: string;
  username?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  role: 'guest' | 'user' | 'admin';
  privacyMode?: boolean;
}
