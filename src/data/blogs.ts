import type { BlogPost } from "@/types/blog";

export const blogs: BlogPost[] = [
  {
    id: "1",
    title: "10 Must-Read Books Every Book Lover Should Read in 2024",
    slug: "10-must-read-books-every-book-lover-should-read",
    category: "Book Recommendations",
    date: "June 15, 2024",
    readTime: "6 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "Whether you're looking for mind-bending mysteries, profound philosophical journeys, or heartwarming narratives, here are 10 exceptional books that will reignite your love for reading.",
    author: {
      name: "Sophia Martinez",
      role: "Senior Literary Critic & Book Curator",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
      bio: "Sophia has reviewed over 500 books across classic fiction, psychology, and modern memoirs. She writes regularly for literary journals and bookstore guides.",
    },
    tags: ["Book Recommendations", "Reading List", "Literature", "Bestsellers", "Inspiration"],
    content: [
      {
        heading: "Rediscovering the Magic of Storytelling",
        body: "Books have an uncanny ability to transport us to worlds beyond our imagination, allowing us to step into lives different from our own. As literature continues to evolve, contemporary authors are pushing thematic boundaries while celebrating classic narrative craft. In this curated collection, we highlight works that capture human resilience, intellectual curiosity, and timeless emotional depth.",
        subsections: [
          {
            subheading: "1. The Power of Micro-Habits in Reading",
            body: "Before diving into large volumes, establishing consistent reading rituals creates sustained mental momentum. Allocating even 20 uninterrupted minutes before sleep or during morning coffee yields over 20 completed titles each year.",
          },
          {
            subheading: "2. Exploring Multi-Genre Catalogs",
            body: "Great readers don't stick to a single shelf. Mixing historical fiction with behavioral economics and reflective poetry broadens cognitive flexibility and prevents reading fatigue.",
          },
        ],
        quote: {
          text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
          author: "George R.R. Martin",
        },
        keyTakeaways: [
          "Cultivate a diversified reading habit spanning multiple genres.",
          "Prioritize depth of engagement over superficial reading speed.",
          "Keep a reading journal to capture impactful quotes and reflections.",
        ],
      },
      {
        heading: "Our Top Curated Picks for This Season",
        body: "From James Clear's groundbreaking framework in Atomic Habits to Matt Haig's metaphysical wonderland in The Midnight Library, each book in this selection offers distinct value. Whether you seek personal transformation or sheer escapism, these titles represent quintessential modern essentials.",
      },
    ],
    comments: [
      {
        id: "c1",
        name: "David Chen",
        date: "June 16, 2024",
        content: "Atomic Habits genuinely changed how I approach my daily work routines. Fantastic compilation!",
      },
      {
        id: "c2",
        name: "Elena Rostova",
        date: "June 17, 2024",
        content: "The Midnight Library has been on my TBR list for months. Moving it straight to the top after reading this post!",
      },
    ],
  },
  {
    id: "2",
    title: "How Reading Can Transform Your Everyday Life & Mental Clarity",
    slug: "how-reading-can-transform-your-everyday-life",
    category: "Reading Tips",
    date: "June 10, 2024",
    readTime: "4 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "Scientific research consistently reveals the neurocognitive benefits of deep reading. Discover how cultivating a reading routine reduces stress, sharpens focus, and nurtures empathy.",
    author: {
      name: "Marcus Vance",
      role: "Cognitive Scientist & Writer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      bio: "Marcus specializes in cognitive behavioral research and mindful living. He advocates for digital minimalism and immersive analog reading.",
    },
    tags: ["Reading Tips", "Mental Health", "Mindfulness", "Self Improvement"],
    content: [
      {
        heading: "Neuroscience Behind Analog Reading",
        body: "In a world saturated with fleeting 15-second video clips and fragmented notifications, sustained reading acts as resistance training for the human prefrontal cortex. When we engage with physical books, our brains construct rich mental simulations, boosting both neural plasticity and emotional resonance.",
        quote: {
          text: "Reading is to the mind what exercise is to the body.",
          author: "Joseph Addison",
        },
        keyTakeaways: [
          "Reading for 15 minutes reduces cortisol levels by up to 68%.",
          "Deep immersive reading strengthens focus and cognitive endurance.",
          "Fiction enhances theory of mind and interpersonal empathy.",
        ],
      },
    ],
    comments: [
      {
        id: "c3",
        name: "Sarah Jenkins",
        date: "June 12, 2024",
        content: "Replacing nighttime phone scrolling with 30 minutes of book reading improved my sleep dramatically.",
      },
    ],
  },
  {
    id: "3",
    title: "New Book Releases You Don't Want to Miss This Month",
    slug: "new-book-releases-you-dont-want-to-miss",
    category: "New Releases",
    date: "June 5, 2024",
    readTime: "5 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "Explore this month's most anticipated fiction releases, groundbreaking non-fiction exposés, and captivating thrillers fresh from publishers around the globe.",
    author: {
      name: "Sophia Martinez",
      role: "Senior Literary Critic & Book Curator",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
      bio: "Sophia has reviewed over 500 books across classic fiction, psychology, and modern memoirs.",
    },
    tags: ["New Releases", "Book Catalog", "Trending", "Fiction"],
    content: [
      {
        heading: "Highlights of the Publishing Season",
        body: "This month delivers an extraordinary lineup of compelling voices. From award-winning investigative journalism to lyrical poetry collections, publishers have unveiled works that tackle contemporary themes with courage and unmatched flair.",
      },
    ],
  },
  {
    id: "4",
    title: "The Best Christian & Inspirational Books for Hope and Purpose",
    slug: "the-best-christian-books-for-inspiration",
    category: "Christian Books",
    date: "May 28, 2024",
    readTime: "7 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "Uplifting devotionals, inspiring memoirs of faith, and spiritual wisdom to guide your daily walk with peace and purpose.",
    author: {
      name: "Jonathan Edwards",
      role: "Theology & Spiritual Life Editor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
      bio: "Jonathan writes on spiritual growth, faith traditions, and devotional literature with over 15 years in faith-based publishing.",
    },
    tags: ["Christian Books", "Faith", "Devotional", "Spiritual Growth", "Inspiration"],
    content: [
      {
        heading: "Finding Solace in Faith-Centric Literature",
        body: "Spiritual literature offers timeless anchors in seasons of uncertainty. These books combine theological depth with practical daily devotion, helping readers foster peace, prayerfulness, and community stewardship.",
      },
    ],
  },
  {
    id: "5",
    title: "Why Building a Daily Reading Habit Matters for Lifelong Success",
    slug: "why-building-a-daily-reading-habit-matters",
    category: "Reading Tips",
    date: "May 22, 2024",
    readTime: "5 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "Learn the compound effect of reading just 20 pages a day, and how top leaders and innovators harness books for lifelong learning.",
    author: {
      name: "Marcus Vance",
      role: "Cognitive Scientist & Writer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      bio: "Marcus specializes in cognitive behavioral research and mindful living.",
    },
    tags: ["Productivity", "Habits", "Reading Tips", "Personal Growth"],
    content: [
      {
        heading: "The 20-Pages-A-Day Principle",
        body: "Compound interest applies to knowledge just as it does to finance. Reading 20 pages per day equates to approximately 7,300 pages each year—equivalent to roughly 25 to 30 full books.",
      },
    ],
  },
  {
    id: "6",
    title: "How to Choose the Perfect Book for Your Current Mood and Taste",
    slug: "how-to-choose-the-perfect-book-for-yourself",
    category: "Book Guide",
    date: "May 16, 2024",
    readTime: "4 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "Stuck in a reading slump? Here is an actionable guide to picking your next book based on pacing, tone, themes, and narrative style.",
    author: {
      name: "Sophia Martinez",
      role: "Senior Literary Critic & Book Curator",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
      bio: "Sophia has reviewed over 500 books across classic fiction, psychology, and modern memoirs.",
    },
    tags: ["Book Guide", "Reading Slump", "Recommendations", "Genres"],
    content: [
      {
        heading: "Diagnosing Your Reading Appetite",
        body: "Not all books fit every mood. When you are feeling mentally fatigued, opting for snappy fast-paced thrillers or illustrated graphic memoirs can instantly reignite the joy of turning pages without intellectual strain.",
      },
    ],
  },
  {
    id: "7",
    title: "The Art of Annotating: Transforming How You Read & Retain Knowledge",
    slug: "the-art-of-annotating-books",
    category: "Reading Tips",
    date: "May 10, 2024",
    readTime: "5 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "Discover margin notes, indexing systems, and color-coded tabs that turn your personal library into an active conversation with brilliant authors.",
    author: {
      name: "Marcus Vance",
      role: "Cognitive Scientist & Writer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      bio: "Marcus specializes in cognitive behavioral research and mindful living.",
    },
    tags: ["Annotations", "Study Habits", "Reading Tips", "Note Taking"],
    content: [
      {
        heading: "Writing in the Margins",
        body: "Annotating is not vandalism; it is active intellectual engagement. Engaging with key arguments, marking contradictions, and noting personal insights ensures deep comprehension.",
      },
    ],
  },
  {
    id: "8",
    title: "Top Christian Classics That Every Believer Should Cherish",
    slug: "top-christian-classics-for-every-believer",
    category: "Christian Books",
    date: "April 28, 2024",
    readTime: "7 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "Explore foundational works by C.S. Lewis, A.W. Tozer, Brother Lawrence, and Hannah Whitehall Smith that continue to shape spiritual journeys.",
    author: {
      name: "Pastor Jonathan Samuel",
      role: "Theological Educator & Author",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop",
      bio: "Pastor Jonathan has authored several devotionals and guides on Christian spirituality.",
    },
    tags: ["Christian Books", "Classics", "Faith", "Devotion"],
    content: [
      {
        heading: "Enduring Spiritual Anchors",
        body: "From 'Mere Christianity' to 'The Pursuit of God', these classics offer theological clarity alongside deep pastoral warmth.",
      },
    ],
  },
  {
    id: "9",
    title: "Unlocking Financial Freedom: Essential Books on Money & Wealth",
    slug: "essential-books-on-money-and-wealth",
    category: "Book Recommendations",
    date: "April 20, 2024",
    readTime: "6 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "A curated guide to the best literature on personal finance, index investing, behavioral economics, and sustainable wealth creation.",
    author: {
      name: "Marcus Vance",
      role: "Cognitive Scientist & Writer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      bio: "Marcus specializes in cognitive behavioral research and mindful living.",
    },
    tags: ["Finance", "Money", "Bestsellers", "Book Recommendations"],
    content: [
      {
        heading: "Mastering the Psychology of Wealth",
        body: "Wealth is not just what you earn; it is how you manage impulses and structure compounding over decades.",
      },
    ],
  },
  {
    id: "10",
    title: "How to Build a Cozy Home Library on Any Budget",
    slug: "how-to-build-a-cozy-home-library",
    category: "Book Guide",
    date: "April 12, 2024",
    readTime: "4 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "Simple design principles, thrift bookstore strategies, and ambient lighting tips to create your dream reading sanctuary at home.",
    author: {
      name: "Sophia Martinez",
      role: "Senior Literary Critic & Book Curator",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
      bio: "Sophia has reviewed over 500 books across classic fiction, psychology, and modern memoirs.",
    },
    tags: ["Home Library", "Book Décor", "Book Guide", "Reading Nook"],
    content: [
      {
        heading: "Creating a Sacred Reading Corner",
        body: "A dedicated reading nook with natural illumination and comfortable seating significantly increases your monthly reading consistency.",
      },
    ],
  },
  {
    id: "11",
    title: "The Golden Age of Historical Fiction: Novels That Bring the Past to Life",
    slug: "golden-age-of-historical-fiction",
    category: "New Releases",
    date: "April 05, 2024",
    readTime: "8 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "Step back in time with breathtaking historical sagas that meticulously blend authentic historical events with compelling character arcs.",
    author: {
      name: "Sophia Martinez",
      role: "Senior Literary Critic & Book Curator",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
      bio: "Sophia has reviewed over 500 books across classic fiction, psychology, and modern memoirs.",
    },
    tags: ["Historical Fiction", "New Releases", "Literature", "Novels"],
    content: [
      {
        heading: "Living History Through Fiction",
        body: "Meticulous world-building and empathetic characterization allow historical fiction to educate and mesmerize readers simultaneously.",
      },
    ],
  },
  {
    id: "12",
    title: "Cultivating Quietness: Meditations for Busy Urban Minds",
    slug: "cultivating-quietness-meditations-for-busy-minds",
    category: "Christian Books",
    date: "March 29, 2024",
    readTime: "5 min read",
    image: "/images/blog/blog.jpg",
    summary:
      "How reflective literature and contemplative prayer restore inner equilibrium in an age of constant digital noise and notifications.",
    author: {
      name: "Pastor Jonathan Samuel",
      role: "Theological Educator & Author",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop",
      bio: "Pastor Jonathan has authored several devotionals and guides on Christian spirituality.",
    },
    tags: ["Christian Books", "Meditation", "Peace", "Mindfulness"],
    content: [
      {
        heading: "The Discipline of Stillness",
        body: "Reclaiming moments of quiet reflection each evening recalibrates our spirit and invites genuine gratitude.",
      },
    ],
  },
];

