export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const categories: Category[] = [
  {
    id: "fiction",
    name: "Fiction",
    slug: "fiction",
  },
  {
    id: "non-fiction",
    name: "Non-Fiction",
    slug: "non-fiction",
  },
  {
    id: "romance",
    name: "Romance",
    slug: "romance",
  },
  {
    id: "mystery",
    name: "Mystery",
    slug: "mystery",
  },
  {
    id: "self-help",
    name: "Self Help",
    slug: "self-help",
  },
  {
    id: "business",
    name: "Business",
    slug: "business",
  },
  {
    id: "kids",
    name: "Kids",
    slug: "kids",
  },
  {
    id: "biography",
    name: "Biography",
    slug: "biography",
  },
  {
    id: "bible-books",
    name: "Bible Books",
    slug: "bible-books",
  },
];