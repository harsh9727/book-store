export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export const categories: Category[] = [
  {
    id: "bible-books",
    name: "Holy Bibles",
    slug: "bible-books",
    description: "Study Bibles, devotional editions, and scripture translations",
  },
  {
    id: "christian-living",
    name: "Christian Living",
    slug: "christian-living",
    description: "Faith, discipleship, family, and spiritual guidance",
  },
  {
    id: "devotionals",
    name: "Devotionals",
    slug: "devotionals",
    description: "Daily morning & evening prayers, reflections, and meditations",
  },
  {
    id: "self-help",
    name: "Self Help & Growth",
    slug: "self-help",
    description: "Personal mastery, habit building, and mental clarity",
  },
  {
    id: "business",
    name: "Business & Finance",
    slug: "business",
    description: "Leadership, wealth creation, strategy, and economics",
  },
  {
    id: "kids",
    name: "Kids & Young Readers",
    slug: "kids",
    description: "Illustrated Bible stories, moral lessons, and early readers",
  },
  {
    id: "biography",
    name: "Biography & Memoirs",
    slug: "biography",
    description: "Inspiring lives of spiritual heroes, pioneers, and thinkers",
  },
  {
    id: "novels",
    name: "Christian Literature & Novels",
    slug: "novels",
    description: "Inspiring fiction, timeless classics, and allegorical stories",
  },
];