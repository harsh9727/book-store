export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  caption?: string;
}

export interface GalleryItem {
  id: string | number;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  location: string;
  coverImage: string;
  description: string;
  story?: string;
  organizer?: string;
  tags: string[];
  photos: GalleryPhoto[];
}
