import type { GalleryItem } from "@/types/gallery";

export const galleries: GalleryItem[] = [
  {
    id: "1",
    slug: "annual-literary-gala-2024",
    title: "Annual Literary Gala & Author Signings 2024",
    subtitle: "A night of celebrations, author discussions, and community book awards",
    category: "Events",
    date: "June 20, 2024",
    location: "ProBooks Flagship Grand Hall, NY",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
    description:
      "Over 400 literature enthusiasts, bestselling authors, and indie publishers gathered for our flagship annual gala celebrating contemporary storytelling, book awards, and live acoustic performances.",
    story:
      "The 2024 Annual Literary Gala marked our 10th anniversary of fostering community among book lovers. The evening featured keynote speeches by celebrated biographers, open floor panel discussions on the future of independent publishing, and an exclusive signing session where attendees met their favorite authors.",
    organizer: "ProBooks Cultural Events Committee",
    tags: ["Literary Gala", "Author Signing", "Book Award", "Community"],
    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
        title: "Grand Hall Book Exhibition",
        caption: "Main display featuring award-winning books and special collector editions.",
      },
      {
        id: "p2",
        url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
        title: "Keynote Author Reading",
        caption: "Authors sharing excerpts from newly released novels with the audience.",
      },
      {
        id: "p3",
        url: "https://images.unsplash.com/photo-1507842229451-7f01be8860ee?q=80&w=1200&auto=format&fit=crop",
        title: "Library Gallery Corner",
        caption: "Guests exploring rare vintage editions and literary memorabilia.",
      },
      {
        id: "p4",
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
        title: "Book Signing Queue",
        caption: "Readers receiving personalized signatures and dedications.",
      },
      {
        id: "p5",
        url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop",
        title: "Acoustic Lounge & Coffee Tasting",
        caption: "Relaxed discussions over artisan coffee and ambient music.",
      },
      {
        id: "p6",
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
        title: "Children's Storytelling Pavilion",
        caption: "Interactive readings and story sessions for young readers.",
      },
    ],
  },
  {
    id: "2",
    slug: "summer-book-fair-and-craft-workshop",
    title: "Summer Book Fair & Rare Editions Showcase",
    subtitle: "Exploring vintage bindings, hand-printed art, and indie publishers",
    category: "Exhibitions",
    date: "May 14, 2024",
    location: "The Open Courtyard, ProBooks Midtown",
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
    description:
      "A vibrant outdoor exhibition featuring antique bookbinders, letterpress artisans, and independent presses showcasing limited edition hardcovers.",
    story:
      "Attendees had the unique chance to observe live leather bookbinding demonstrations and participate in bookmark calligraphy workshops led by master artisans.",
    organizer: "Artisan Guild & ProBooks",
    tags: ["Book Fair", "Artisan", "Rare Books", "Workshops"],
    photos: [
      {
        id: "p7",
        url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
        title: "Outdoor Reading Tables",
        caption: "Sunny courtyards dedicated to open reading and community browsing.",
      },
      {
        id: "p8",
        url: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?q=80&w=1200&auto=format&fit=crop",
        title: "Handcrafted Bookmarks & Prints",
        caption: "Artisan crafts, custom leather sleeves, and bookplates.",
      },
      {
        id: "p9",
        url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1200&auto=format&fit=crop",
        title: "Book Collectors Table",
        caption: "First edition showcase and preservation consultation booth.",
      },
    ],
  },
  {
    id: "3",
    slug: "youth-literacy-and-story-hour",
    title: "Youth Literacy Story Hour & Creative Writing Workshop",
    subtitle: "Nurturing young imaginations through storytelling and interactive theater",
    category: "Community",
    date: "April 29, 2024",
    location: "Children's Wonderland Studio, ProBooks",
    coverImage: "https://images.unsplash.com/photo-1507842229451-7f01be8860ee?q=80&w=1200&auto=format&fit=crop",
    description:
      "Children and parents joined acclaimed picture book illustrators for interactive puppet storytelling, drawing games, and creative writing exercises.",
    story:
      "Our monthly Youth Literacy series aims to instill an enduring passion for reading in kids aged 4-12. Over 100 children created their own illustrated mini-books during this workshop.",
    organizer: "ProBooks Youth Foundation",
    tags: ["Youth", "Story Hour", "Creative Writing", "Children"],
    photos: [
      {
        id: "p10",
        url: "https://images.unsplash.com/photo-1507842229451-7f01be8860ee?q=80&w=1200&auto=format&fit=crop",
        title: "Story Circle",
        caption: "Storyteller leading a lively interactive reading of classic folk tales.",
      },
      {
        id: "p11",
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
        title: "Mini-Book Craft Station",
        caption: "Young creators designing their first illustrated story booklets.",
      },
      {
        id: "p12",
        url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop",
        title: "Young Readers Corner",
        caption: "Cozy reading beanbags and colorful picture book shelves.",
      },
    ],
  },
  {
    id: "4",
    slug: "midnight-release-fantasy-festival",
    title: "Midnight Release Party & Fantasy Cosplay Night",
    subtitle: "Celebrating monumental fantasy epic launches under candlelight",
    category: "Book Launches",
    date: "March 18, 2024",
    location: "ProBooks Downtown Atrium",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
    description:
      "An unforgettable midnight launch with immersive world-themed mocktails, trivia battles, costume contests, and instant midnight pickups.",
    story:
      "Fans queued from 8 PM with themed costumes from favorite sci-fi and fantasy series. At the stroke of midnight, the first copies were handed out amidst cheers and festive celebration.",
    organizer: "ProBooks Sci-Fi & Fantasy Guild",
    tags: ["Midnight Launch", "Fantasy", "Cosplay", "Book Release"],
    photos: [
      {
        id: "p13",
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
        title: "Midnight Unboxing",
        caption: "The moment the boxes were unsealed as the clock struck twelve.",
      },
      {
        id: "p14",
        url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop",
        title: "Trivia Champion Presentation",
        caption: "Awarding signed first-edition boxed sets to trivia champions.",
      },
    ],
  },
  {
    id: "5",
    slug: "theology-and-scripture-symposium",
    title: "Theology & Scripture Symposium 2024",
    subtitle: "Exploring historical Christian manuscripts, translations, and devotionals",
    category: "Exhibitions",
    date: "February 22, 2024",
    location: "ProBooks Academic Annex",
    coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop",
    description:
      "Scholars, pastors, and theology students gathered to examine rare historical biblical translations, illuminated manuscripts, and contemporary devotional literature.",
    story:
      "A peaceful day of learning, manuscript displays, and panel discussions on preserving scriptural integrity across generations.",
    organizer: "Christian Heritage Study Group",
    tags: ["Theology", "Manuscripts", "Exhibition", "Faith"],
    photos: [
      {
        id: "p15",
        url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop",
        title: "Rare Manuscript Showcase",
        caption: "Preserved biblical commentaries dating back centuries.",
      },
    ],
  },
  {
    id: "6",
    slug: "poetry-and-acoustic-open-mic",
    title: "Poetry & Acoustic Coffeehouse Evening",
    subtitle: "An intimate night of spoken word, reflective poetry, and artisan brews",
    category: "Community",
    date: "February 10, 2024",
    location: "ProBooks Mezzanine Lounge",
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
    description:
      "Local poets, songwriters, and prose writers performed original compositions to a warm audience in our atmospheric bookstore lounge.",
    story:
      "Over 80 community members enjoyed freshly roasted coffee and soothing acoustic melodies alongside heartfelt spoken word poetry.",
    organizer: "ProBooks Literary Society",
    tags: ["Poetry", "Acoustic", "Community", "Open Mic"],
    photos: [
      {
        id: "p16",
        url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop",
        title: "Spoken Word Performance",
        caption: "Local poet sharing verses from their newly published chapbook.",
      },
    ],
  },
  {
    id: "7",
    slug: "spring-book-club-roundtable",
    title: "Spring Book Club Leaders Summit & Mixer",
    subtitle: "Connecting book club hosts from across the region to share reading curricula",
    category: "Events",
    date: "January 28, 2024",
    location: "ProBooks Conference Suite",
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
    description:
      "A collaborative summit for reading group moderators to exchange discussion prompts, author interview schedules, and reading challenges.",
    story:
      "Book club leaders networked, shared best practices for engaging quiet readers, and received curated reading kit boxes.",
    organizer: "ProBooks Reader Network",
    tags: ["Book Club", "Roundtable", "Networking", "Events"],
    photos: [
      {
        id: "p17",
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
        title: "Roundtable Discussion",
        caption: "Group leaders collaborating on annual reading lists.",
      },
    ],
  },
  {
    id: "8",
    slug: "young-authors-writing-masterclass",
    title: "Young Authors Creative Writing Masterclass",
    subtitle: "Hands-on narrative crafting workshops led by award-winning novelists",
    category: "Book Launches",
    date: "January 15, 2024",
    location: "ProBooks Creative Studio",
    coverImage: "https://images.unsplash.com/photo-1507842229451-7f01be8860ee?q=80&w=1200&auto=format&fit=crop",
    description:
      "Aspiring novelists aged 14-22 learned world-building, dialogue writing, and character development in an interactive daylong workshop.",
    story:
      "Students received one-on-one editorial critique on their manuscript outlines and participated in live character sketching exercises.",
    organizer: "ProBooks Youth Literacy Foundation",
    tags: ["Creative Writing", "Masterclass", "Youth", "Workshop"],
    photos: [
      {
        id: "p18",
        url: "https://images.unsplash.com/photo-1507842229451-7f01be8860ee?q=80&w=1200&auto=format&fit=crop",
        title: "Manuscript Workshop",
        caption: "Instructor giving feedback on student plot outlines.",
      },
    ],
  },
];
