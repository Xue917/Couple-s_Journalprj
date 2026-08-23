export type UserType = '男方' | '女方';

export interface PlaceItem {
  id: number;
  name: string;
  category: 'visited' | 'wish';
  note: string;
  createdBy: string;
  createdAt: string;
  visitDate?: string;
  imageUrl?: string;
  lat: number;
  lng: number;
}

export interface PostItem {
  id: number;
  author: string;
  avatar: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  comments: { id: number; author: string; text: string }[];
}