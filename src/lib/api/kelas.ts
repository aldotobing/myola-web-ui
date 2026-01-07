/** @format */

import { Course, Video, CourseProgress } from "@/types/kelas";

// lib/api/courses.ts

// Mock data untuk courses
const coursesData: Course[] = [
  {
    id: "course-1",
    title: "Rich Bronde and Brunnete Hair",
    instructor: "Andrea Bennett",
    thumbnail: "https://placehold.co/800x450/ec4899/ffffff?text=Hair+Coloring",
    description:
      "Learn professional hair coloring techniques for rich bronde and brunette shades. Master the art of creating dimensional color with expert guidance.",
    skillsGained: [
      "Back to back foil technique",
      "Block colour",
      "Colour placement sectioning",
      "Foil sectioning",
    ],
    totalVideos: 4,
    completedVideos: 2,
    progress: 50,
    enrolledDate: "2 Agustus 2025",
    startDate: "2 Agustus 2025",
    status: "in_progress",
    videos: [
      {
        id: "video-1-1",
        title: "Colour Melt Technique",
        duration: "4 menit",
        youtubeUrl: "https://youtu.be/FQvZXuO0SsM?si=KO8BdTRI-x1GdXoo",
        completed: true,
        order: 1,
      },
      {
        id: "video-1-2",
        title: "Reflective Ombre Hair Colour",
        duration: "6 menit",
        youtubeUrl: "https://youtu.be/0FjtZz-zWWs?si=Vv0kaoTFYT6S_Bf8",
        completed: true,
        order: 2,
      },
      {
        id: "video-1-3",
        title: "Splash Light Halo Colour Technique",
        duration: "8 menit",
        youtubeUrl: "https://youtu.be/0FjtZz-zWWs?si=3ohs3268JtagWxyj",
        completed: false,
        order: 3,
      },
      {
        id: "video-1-4",
        title: "Shadow And Light Hair Colour",
        duration: "10 menit",
        youtubeUrl: "https://youtu.be/FQvZXuO0SsM?si=KO8BdTRI-x1GdXoo",
        completed: false,
        order: 4,
      },
    ],
  },
  {
    id: "course-2",
    title: "Brown and Brunnete Hair - Advanced",
    instructor: "Sarah Johnson",
    thumbnail: "https://placehold.co/800x450/ec4899/ffffff?text=Advanced+Hair",
    description:
      "Advanced techniques for creating stunning bronde and brunette hair colors.",
    skillsGained: [
      "Color theory",
      "Balayage technique",
      "Toning mastery",
      "Client consultation",
    ],
    totalVideos: 5,
    completedVideos: 5,
    progress: 100,
    enrolledDate: "10 Agustus 2025",
    status: "completed",
    videos: [
      {
        id: "video-2-1",
        title: "Introduction to Color Theory",
        duration: "5 menit",
        youtubeUrl: "https://youtu.be/FQvZXuO0SsM?si=KO8BdTRI-x1GdXoo",
        completed: true,
        order: 1,
      },
      {
        id: "video-2-2",
        title: "Balayage Fundamentals",
        duration: "12 menit",
        youtubeUrl: "https://youtu.be/0FjtZz-zWWs?si=Vv0kaoTFYT6S_Bf8",
        completed: true,
        order: 2,
      },
      {
        id: "video-2-3",
        title: "Advanced Balayage Patterns",
        duration: "15 menit",
        youtubeUrl: "https://youtu.be/0FjtZz-zWWs?si=3ohs3268JtagWxyj",
        completed: true,
        order: 3,
      },
      {
        id: "video-2-4",
        title: "Toning Techniques",
        duration: "8 menit",
        youtubeUrl: "https://youtu.be/FQvZXuO0SsM?si=KO8BdTRI-x1GdXoo",
        completed: true,
        order: 4,
      },
      {
        id: "video-2-5",
        title: "Client Consultation Best Practices",
        duration: "6 menit",
        youtubeUrl: "https://youtu.be/0FjtZz-zWWs?si=Vv0kaoTFYT6S_Bf8",
        completed: true,
        order: 5,
      },
    ],
  },
  {
    id: "course-3",
    title: "Curly Hair",
    instructor: "Michael Chen",
    thumbnail: "https://placehold.co/800x450/ec4899/ffffff?text=Hair+Mastery",
    description:
      "Complete mastery course for professional hair coloring techniques.",
    skillsGained: [
      "Professional sectioning",
      "Color correction",
      "Blending techniques",
      "Aftercare guidance",
    ],
    totalVideos: 4,
    completedVideos: 0,
    progress: 0,
    enrolledDate: "15 Agustus 2025",
    status: "not_started",
    videos: [
      {
        id: "video-3-1",
        title: "Professional Sectioning Methods",
        duration: "7 menit",
        youtubeUrl: "https://youtu.be/FQvZXuO0SsM?si=KO8BdTRI-x1GdXoo",
        completed: false,
        order: 1,
      },
      {
        id: "video-3-2",
        title: "Color Correction Basics",
        duration: "10 menit",
        youtubeUrl: "https://youtu.be/0FjtZz-zWWs?si=Vv0kaoTFYT6S_Bf8",
        completed: false,
        order: 2,
      },
      {
        id: "video-3-3",
        title: "Seamless Blending Techniques",
        duration: "9 menit",
        youtubeUrl: "https://youtu.be/0FjtZz-zWWs?si=3ohs3268JtagWxyj",
        completed: false,
        order: 3,
      },
      {
        id: "video-3-4",
        title: "Aftercare and Maintenance",
        duration: "5 menit",
        youtubeUrl: "https://youtu.be/FQvZXuO0SsM?si=KO8BdTRI-x1GdXoo",
        completed: false,
        order: 4,
      },
    ],
  },
  {
    id: "course-4",
    title: "Kpop Hair Coloring",
    instructor: "Andrea Bennett",
    thumbnail: "https://placehold.co/800x450/ec4899/ffffff?text=Hair+Coloring",
    description:
      "Learn professional hair coloring techniques for rich bronde and brunette shades. Master the art of creating dimensional color with expert guidance.",
    skillsGained: [
      "Back to back foil technique",
      "Block colour",
      "Colour placement sectioning",
      "Foil sectioning",
    ],
    totalVideos: 4,
    completedVideos: 2,
    progress: 75,
    enrolledDate: "2 Agustus 2025",
    startDate: "2 Agustus 2025",
    status: "in_progress",
    videos: [
      {
        id: "video-1-1",
        title: "Colour Melt Technique",
        duration: "4 menit",
        youtubeUrl: "https://youtu.be/FQvZXuO0SsM?si=KO8BdTRI-x1GdXoo",
        completed: true,
        order: 1,
      },
      {
        id: "video-1-2",
        title: "Reflective Ombre Hair Colour",
        duration: "6 menit",
        youtubeUrl: "https://youtu.be/0FjtZz-zWWs?si=Vv0kaoTFYT6S_Bf8",
        completed: true,
        order: 2,
      },
      {
        id: "video-1-3",
        title: "Splash Light Halo Colour Technique",
        duration: "8 menit",
        youtubeUrl: "https://youtu.be/0FjtZz-zWWs?si=3ohs3268JtagWxyj",
        completed: true,
        order: 3,
      },
      {
        id: "video-1-4",
        title: "Shadow And Light Hair Colour",
        duration: "10 menit",
        youtubeUrl: "https://youtu.be/FQvZXuO0SsM?si=KO8BdTRI-x1GdXoo",
        completed: false,
        order: 4,
      },
    ],
  },
];

// Storage untuk progress (dalam real app, ini akan ke database)
let progressStorage: CourseProgress[] = [
  {
    courseId: "course-1",
    userId: "user-1",
    completedVideoIds: ["video-1-1", "video-1-2"],
    currentVideoId: "video-1-3",
    lastAccessedAt: new Date().toISOString(),
  },
];

/**
 * Get all courses for a user
 */
export async function getUserCourses(
  userId: string = "user-1"
): Promise<Course[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Update courses with user's progress
  const coursesWithProgress = coursesData.map((course) => {
    const progress = progressStorage.find(
      (p) => p.courseId === course.id && p.userId === userId
    );

    if (!progress) return course;

    const updatedVideos = course.videos.map((video) => ({
      ...video,
      completed: progress.completedVideoIds.includes(video.id),
    }));

    const completedVideos = updatedVideos.filter((v) => v.completed).length;
    const progressPercentage = Math.round(
      (completedVideos / course.totalVideos) * 100
    );

    let status: Course["status"] = "not_started";
    if (completedVideos > 0 && completedVideos < course.totalVideos) {
      status = "in_progress";
    } else if (completedVideos === course.totalVideos) {
      status = "completed";
    }

    return {
      ...course,
      videos: updatedVideos,
      completedVideos,
      progress: progressPercentage,
      status,
    };
  });

  return coursesWithProgress;
}

/**
 * Get courses by status
 */
export async function getCoursesByStatus(
  status: "in_progress" | "completed",
  userId: string = "user-1"
): Promise<Course[]> {
  const allCourses = await getUserCourses(userId);
  return allCourses.filter((course) => course.status === status);
}

/**
 * Get a single course by ID
 */
export async function getCourseById(
  courseId: string,
  userId: string = "user-1"
): Promise<Course | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const course = coursesData.find((c) => c.id === courseId);
  if (!course) return null;

  const progress = progressStorage.find(
    (p) => p.courseId === courseId && p.userId === userId
  );

  if (!progress) return course;

  const updatedVideos = course.videos.map((video) => ({
    ...video,
    completed: progress.completedVideoIds.includes(video.id),
  }));

  const completedVideos = updatedVideos.filter((v) => v.completed).length;
  const progressPercentage = Math.round(
    (completedVideos / course.totalVideos) * 100
  );

  let status: Course["status"] = "not_started";
  if (completedVideos > 0 && completedVideos < course.totalVideos) {
    status = "in_progress";
  } else if (completedVideos === course.totalVideos) {
    status = "completed";
  }

  return {
    ...course,
    videos: updatedVideos,
    completedVideos,
    progress: progressPercentage,
    status,
  };
}

/**
 * Mark a video as completed and move to next video
 */
export async function completeVideo(
  courseId: string,
  videoId: string,
  userId: string = "user-1"
): Promise<{
  success: boolean;
  course?: Course;
  nextVideo?: Video;
  error?: string;
}> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const course = coursesData.find((c) => c.id === courseId);
    if (!course) {
      return { success: false, error: "Course not found" };
    }

    const video = course.videos.find((v) => v.id === videoId);
    if (!video) {
      return { success: false, error: "Video not found" };
    }

    // Find or create progress entry
    let progressIndex = progressStorage.findIndex(
      (p) => p.courseId === courseId && p.userId === userId
    );

    if (progressIndex === -1) {
      // Create new progress entry
      progressStorage.push({
        courseId,
        userId,
        completedVideoIds: [],
        currentVideoId: videoId,
        lastAccessedAt: new Date().toISOString(),
      });
      progressIndex = progressStorage.length - 1;
    }

    // Add video to completed list if not already there
    if (!progressStorage[progressIndex].completedVideoIds.includes(videoId)) {
      progressStorage[progressIndex].completedVideoIds.push(videoId);
    }

    // Find next video
    const currentVideoIndex = course.videos.findIndex((v) => v.id === videoId);
    const nextVideo =
      currentVideoIndex < course.videos.length - 1
        ? course.videos[currentVideoIndex + 1]
        : null;

    // Update current video
    progressStorage[progressIndex].currentVideoId = nextVideo?.id || null;
    progressStorage[progressIndex].lastAccessedAt = new Date().toISOString();

    // If all videos completed, mark course as completed
    if (
      progressStorage[progressIndex].completedVideoIds.length ===
      course.totalVideos
    ) {
      progressStorage[progressIndex].completedAt = new Date().toISOString();
    }

    // Get updated course
    const updatedCourse = await getCourseById(courseId, userId);

    return {
      success: true,
      course: updatedCourse || undefined,
      nextVideo: nextVideo || undefined,
    };
  } catch (error) {
    console.error("Error completing video:", error);
    return { success: false, error: "Failed to complete video" };
  }
}

/**
 * Get next video to watch in a course
 */
export async function getNextVideo(
  courseId: string,
  userId: string = "user-1"
): Promise<Video | null> {
  const course = await getCourseById(courseId, userId);
  if (!course) return null;

  // Find first uncompleted video
  const nextVideo = course.videos.find((video) => !video.completed);
  return nextVideo || null;
}

/**
 * Get current watching video
 */
export async function getCurrentVideo(
  courseId: string,
  userId: string = "user-1"
): Promise<Video | null> {
  const progress = progressStorage.find(
    (p) => p.courseId === courseId && p.userId === userId
  );

  if (!progress || !progress.currentVideoId) {
    // Return first video if no progress
    const course = await getCourseById(courseId, userId);
    return course?.videos[0] || null;
  }

  const course = await getCourseById(courseId, userId);
  if (!course) return null;

  return course.videos.find((v) => v.id === progress.currentVideoId) || null;
}

/**
 * Reset course progress (for testing)
 */
export async function resetCourseProgress(
  courseId: string,
  userId: string = "user-1"
): Promise<{ success: boolean }> {
  progressStorage = progressStorage.filter(
    (p) => !(p.courseId === courseId && p.userId === userId)
  );
  return { success: true };
}
