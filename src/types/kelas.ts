/** @format */

// types/course.ts

export interface Video {
  id: string;
  title: string;
  duration: string; // Format: "4 menit", "10 menit"
  youtubeUrl: string;
  completed: boolean;
  order: number; // Urutan video dalam course
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  description: string;
  skillsGained: string[];
  totalVideos: number;
  completedVideos: number;
  progress: number; // 0-100
  enrolledDate: string;
  startDate?: string; // Tanggal mulai belajar pertama kali
  status: "not_started" | "in_progress" | "completed";
  videos: Video[];
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  completedVideoIds: string[];
  currentVideoId: string | null;
  lastAccessedAt: string;
  completedAt?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  courses: Course[];
}
