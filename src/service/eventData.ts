/** @format */

export interface EventData {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  category: string;
  slug: string;
}

export interface EventDetail {
  slug: string;
  eventTitle: string;
  title: string;
  description: string;
  instructor: string;
  level: string;
  date: string;
  time: string;
  enrolled: string;
  image: string;
  aboutText: string;
  price: string;
  whatYouLearn: string[];
  skillGained: string[];
}

export const EVENT_DATA: EventData[] = [
  {
    id: "1",
    title: "Precision Cutting for Modern Styles",
    image: "/images/kelas_1.png",
    date: "20 October 2025",
    time: "16.00 WIB",
    category: "MASTERCLASS",
    slug: "precision-cutting-modern-styles-1",
  },
  {
    id: "2",
    title: "Precision Cutting for Modern Styles",
    image: "/images/kelas_2.png",
    date: "20 October 2025",
    time: "16.00 WIB",
    category: "MASTERCLASS",
    slug: "precision-cutting-modern-styles-2",
  },
  {
    id: "3",
    title: "Precision Cutting for Modern Styles",
    image: "/images/kelas_3.png",
    date: "20 October 2025",
    time: "16.00 WIB",
    category: "MASTERCLASS",
    slug: "precision-cutting-modern-styles-3",
  },
];

// Helper function to get event by slug
export function getEventBySlug(slug: string): EventData | undefined {
  return EVENT_DATA.find((event) => event.slug === slug);
}

// Event Details Data
export const EVENT_DETAIL_DATA: EventDetail[] = [
  {
    slug: "precision-cutting-modern-styles-1",
    eventTitle: "Precision Cutting for Modern Styles",
    title: "Rich Bronde and Brunette Hair",
    description:
      "Rich bronde and brunette hair colours that will provide you with the skills and knowledge to contour and hairylights to add a desirable play of light.",
    instructor: "Andrea Bennett",
    level: "Intermediate",
    date: "12 December 2025",
    time: "14.00 - 15.00 WIB",
    enrolled: "Flexible",
    image: "/images/thumb.jpg",
    price: "Rp 200.000",
    aboutText:
      "This on-demand hairdressing course teaches you how to create 5 salon-friendly, rich bronde and brunette hair colours that will provide you with the skills and knowledge to contour your hairstyles to add a desirable play of light. This collection features a range of internationally respected educators and hairdressers including Jo McKay, Harriet Mcleod, Louise Hawes and Sue Dixon. On completion, you can download, print and share a CPD Certificate of Recognition.",
    whatYouLearn: [
      "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
      "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
      "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
      "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
    ],
    skillGained: [
      "Color Melting",
      "Hair Contouring",
      "Color Theory",
      "Balayage Techniques",
    ],
  },
];

// Add more lesson details as needed

// Helper function to get product detail by slug
export function getEventDetailBySlug(slug: string): EventDetail | undefined {
  return EVENT_DETAIL_DATA.find((event) => event.slug === slug);
}
