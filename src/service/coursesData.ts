/** @format */

// lib/coursesData.ts

export interface CourseData {
  slug: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  fillCount: number;
  hugCount: number;
  description?: string;
  instructor?: string;
}

export interface LessonData {
  id: string;
  courseSlug: string; // To link lesson to course
  title: string;
  duration: string;
  isLocked: boolean;
  thumbnail: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  videoCount: number;
}

export interface VideoModule {
  id: string;
  lessonId: string; // Link to lesson
  title: string;
  description: string;
  duration: string;
  level: string;
  thumbnail: string;
  skillsGained: string[];
  whatYouLearn: string;
}

export interface LessonDetail {
  courseTitle: string;
  title: string;
  description: string;
  instructor: string;
  level: string;
  videoCount: number;
  duration: string;
  enrolled: string;
  image: string;
  aboutText: string;
  whatYouLearn: string[];
  videoModules: VideoModule[];
}

export const COURSES_DATA: CourseData[] = [
  {
    slug: "shadow-light-hair-color",
    title: "SHADOW & LIGHT HAIR COLOR",
    level: "Beginner",
    image: "/images/kelas_1.png",
    fillCount: 10,
    hugCount: 10,
    description:
      "Pelajari teknik pewarnaan rambut shadow & light yang profesional",
    instructor: "Andrea Bennett",
  },
  {
    slug: "avant-garde-hairstyles",
    title: "AVANT-GARDE HAIRSTYLES",
    level: "Beginner",
    image: "/images/kelas_2.png",
    fillCount: 10,
    hugCount: 10,
    description:
      "Teknik avant-garde hairstyles untuk gaya rambut yang inovatif",
    instructor: "Andrea Bennett",
  },
  {
    slug: "creativity-in-hues-of-red",
    title: "CREATIVITY IN HUES OF RED",
    level: "Beginner",
    image: "/images/kelas_3.png",
    fillCount: 10,
    hugCount: 10,
    description: "Eksplorasi kreativitas dengan berbagai nuansa warna merah",
    instructor: "Andrea Bennett",
  },
  {
    slug: "reflexion-color-hair-cut",
    title: "REFLEXION COLOR HAIR CUT",
    level: "Beginner",
    image: "/images/kelas_4.png",
    fillCount: 10,
    hugCount: 10,
    description: "Teknik pewarnaan dan potongan rambut refleksi yang modern",
    instructor: "Andrea Bennett",
  },
  {
    slug: "the-back-bar-basics-hair",
    title: "THE BACK BAR BASICS HAIR",
    level: "Intermediate",
    image: "/images/kelas_3.png",
    fillCount: 10,
    hugCount: 10,
    description: "Dasar-dasar teknik back bar untuk stylist profesional",
    instructor: "Andrea Bennett",
  },
  {
    slug: "curls-curls-curls-hair",
    title: "CURLS, CURLS, CURLS HAIR",
    level: "Intermediate",
    image: "/images/kelas_3.png",
    fillCount: 10,
    hugCount: 10,
    description: "Master teknik curling untuk berbagai jenis rambut",
    instructor: "Andrea Bennett",
  },
  {
    slug: "build-layering-graduation",
    title: "BUILD LAYERING & GRADUATION",
    level: "Intermediate",
    image: "/images/kelas_2.png",
    fillCount: 10,
    hugCount: 10,
    description:
      "Teknik layering dan graduation untuk potongan rambut bertekstur",
    instructor: "Andrea Bennett",
  },
  {
    slug: "mens-cuts-short-back-sides",
    title: "MEN'S CUTS: SHORT BACK & SIDES",
    level: "Intermediate",
    image: "/images/kelas_1.png",
    fillCount: 10,
    hugCount: 10,
    description: "Potongan rambut pria klasik dengan teknik modern",
    instructor: "Andrea Bennett",
  },
];

// Lessons Data
export const LESSONS_DATA: LessonData[] = [
  // Shadow & Light Hair Color Lessons
  {
    id: "1",
    courseSlug: "shadow-light-hair-color",
    title: "RICH BRONDE AND BRUNETTE HAIR",
    duration: "2 jam 6 menit",
    isLocked: false,
    thumbnail: "/images/kelas_3.png",
    level: "Beginner",
    videoCount: 5,
  },
  {
    id: "2",
    courseSlug: "shadow-light-hair-color",
    title: "MODERN PLAY OF LIGHT COLOR",
    duration: "2 jam 6 menit",
    isLocked: false,
    thumbnail: "/images/kelas_1.png",
    level: "Beginner",
    videoCount: 5,
  },
  {
    id: "3",
    courseSlug: "shadow-light-hair-color",
    title: "ICE CREAM SHADES HAIR COLOUR",
    duration: "2 jam 6 menit",
    isLocked: false,
    thumbnail: "/images/kelas_2.png",
    level: "Beginner",
    videoCount: 5,
  },
  {
    id: "4",
    courseSlug: "shadow-light-hair-color",
    title: "CORRECTING COLOUR WITH TRACY HAYES",
    duration: "2 jam 6 menit",
    isLocked: false,
    thumbnail: "/images/kelas_4.png",
    level: "Beginner",
    videoCount: 5,
  },
  // Avant-Garde Hairstyles Lessons
  {
    id: "5",
    courseSlug: "avant-garde-hairstyles",
    title: "CREATIVE STYLING FUNDAMENTALS",
    duration: "1 jam 45 menit",
    isLocked: false,
    thumbnail: "/images/kelas_4.png",
    level: "Beginner",
    videoCount: 4,
  },
  {
    id: "6",
    courseSlug: "avant-garde-hairstyles",
    title: "AVANT-GARDE TEXTURE TECHNIQUES",
    duration: "2 jam 15 menit",
    isLocked: false,
    thumbnail: "/images/kelas_1.png",
    level: "Beginner",
    videoCount: 5,
  },
];

// Lesson Details Data
export const LESSON_DETAILS: Record<string, LessonDetail> = {
  "rich-bronde-and-brunette-hair": {
    courseTitle: "Shadow & Light Hair Color",
    title: "Rich Bronde and Brunette Hair",
    description:
      "Rich bronde and brunette hair colours that will provide you with the skills and knowledge to contour and hairylights to add a desirable play of light.",
    instructor: "Andrea Bennett",
    level: "Intermediate",
    videoCount: 5,
    duration: "1 jam 5 menit",
    enrolled: "Flexible",
    image: "/images/thumb.jpg",
    aboutText:
      "This on-demand hairdressing course teaches you how to create 5 salon-friendly, rich bronde and brunette hair colours that will provide you with the skills and knowledge to contour your hairstyles to add a desirable play of light. This collection features a range of internationally respected educators and hairdressers including Jo McKay, Harriet Mcleod, Louise Hawes and Sue Dixon. On completion, you can download, print and share a CPD Certificate of Recognition.",
    whatYouLearn: [
      "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
      "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
      "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
      "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
    ],
    videoModules: [
      {
        id: "1",
        lessonId: "rich-bronde-and-brunette-hair",
        title: "Colour Melt Technique",
        description:
          "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
        duration: "30 minutes",
        level: "Intermediate",
        thumbnail: "/images/thumb.jpg",
        skillsGained: [
          "Rich bronde techniques",
          "Base colour",
          "Visual placement techniques",
          "pre sectioning",
        ],
        whatYouLearn:
          "In lesson one Jo McKay demonstrates a stunning colour melt technique that incorporates a perimeter base colour and application of a lighter colour through the mid-lengths and ends. You will learn how to pre-segment the head in areas and locate the hairline.",
      },
      {
        id: "2",
        lessonId: "rich-bronde-and-brunette-hair",
        title: "Colour Melt Technique",
        description:
          "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
        duration: "30 minutes",
        level: "Intermediate",
        thumbnail: "/images/thumb.jpg",
        skillsGained: [
          "Rich bronde techniques",
          "Base colour",
          "Visual placement techniques",
        ],
        whatYouLearn:
          "Continue mastering the colour melt technique with advanced application methods.",
      },
      {
        id: "3",
        lessonId: "rich-bronde-and-brunette-hair",
        title: "Reflective Ombre Hair Colour",
        description:
          "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
        duration: "30 minutes",
        level: "Intermediate",
        thumbnail: "/images/thumb.jpg",
        skillsGained: ["Ombre techniques", "Color blending"],
        whatYouLearn:
          "Learn reflective ombre techniques for stunning hair transformations.",
      },
      {
        id: "4",
        lessonId: "rich-bronde-and-brunette-hair",
        title: "Splash Light Halo Colour Technique",
        description:
          "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
        duration: "30 minutes",
        level: "Intermediate",
        thumbnail: "/images/thumb.jpg",
        skillsGained: ["Halo highlighting", "Light placement"],
        whatYouLearn:
          "Master the splash light halo technique for dimensional color.",
      },
      {
        id: "5",
        lessonId: "rich-bronde-and-brunette-hair",
        title: "Shadow And Light Hair Colour",
        description:
          "Discover a colour melt technique combining a rich perimeter base with lighter mid-lengths and ends — blending caramel and violet tones for a smooth, luminous finish.",
        duration: "30 minutes",
        level: "Intermediate",
        thumbnail: "/images/thumb.jpg",
        skillsGained: ["Shadow techniques", "Dimensional color"],
        whatYouLearn:
          "Perfect shadow and light techniques for professional results.",
      },
    ],
  },
  // Add more lesson details as needed
};

// Helper function to get course by slug
export function getCourseBySlug(slug: string): CourseData | undefined {
  return COURSES_DATA.find((course) => course.slug === slug);
}

// Helper function to get all courses by level
export function getCoursesByLevel(
  level: "Beginner" | "Intermediate" | "Advanced"
): CourseData[] {
  return COURSES_DATA.filter((course) => course.level === level);
}

// Helper function to get lessons by course slug
export function getLessonsByCourseSlug(courseSlug: string): LessonData[] {
  return LESSONS_DATA.filter((lesson) => lesson.courseSlug === courseSlug);
}

// Helper function to get lesson by ID
export function getLessonById(lessonId: string): LessonData | undefined {
  return LESSONS_DATA.find((lesson) => lesson.id === lessonId);
}

// Helper function to get lesson detail by slug
export function getLessonDetailBySlug(
  lessonSlug: string
): LessonDetail | undefined {
  return LESSON_DETAILS[lessonSlug];
}
