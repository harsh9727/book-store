export interface BlogComment {
  id: string;
  name: string;
  avatar?: string;
  date: string;
  content: string;
}

export interface BlogContentSection {
  heading?: string;
  body: string;
  subsections?: {
    subheading: string;
    body: string;
  }[];
  quote?: {
    text: string;
    author: string;
  };
  keyTakeaways?: string[];
}

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  date: string;
  image: string;
  imageKey?: string;
  summary: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio?: string;
  };
  tags?: string[];
  content: BlogContentSection[];
  comments?: BlogComment[];
}
