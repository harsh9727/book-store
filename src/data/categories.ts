export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const categories: Category[] = [
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