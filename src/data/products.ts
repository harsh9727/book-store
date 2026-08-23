export interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    price: 18.99,
    image: "/images/products/atomic-habits.jpg",
    category: "self-help",
  },
  {
    id: "the-midnight-library",
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 16.99,
    image: "/images/products/midnight-library.jpg",
    category: "novels",
  },
  {
    id: "it-ends-with-us",
    title: "It Ends With Us",
    author: "Colleen Hoover",
    price: 15.99,
    image: "/images/products/it-ends-with-us.jpg",
    category: "romance",
  },
  {
    id: "the-silent-patient",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 14.99,
    image: "/images/products/silent-patient.jpg",
    category: "mystery",
  },
  {
    id: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 14.99,
    image: "/images/products/rich-dad-poor-dad.jpg",
    category: "business",
  },
  {
    id: "think-and-grow-rich",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    price: 12.99,
    image: "/images/products/think-and-grow-rich.jpg",
    category: "self-help",
  },
];