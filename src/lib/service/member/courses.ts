/** @format */

import { createClient } from "@/utils/supabase/client";

// Create a single instance for the client-side service
const supabase = createClient();

export interface CourseData {
  title: string;
  level: string;
  image: string;
  fillCount: number;
  hugCount: number;
  slug: string;
  id: string;
  description?: string;
  instructor?: string;
}

/**
 * Get all courses from Supabase
 */
export async function getAllCourses(): Promise<CourseData[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    if (error.message?.includes('AbortError')) return [];
    console.error("Error fetching courses:", error);
    return [];
  }

  return data.map((c: any) => ({
    id: c.id,
    title: c.title,
    level: c.level || "Beginner",
    image: c.thumbnail_url || "https://placehold.co/800x450/ec4899/ffffff?text=Course",
    fillCount: c.fill_count || 0,
    hugCount: c.hug_count || 0,
    slug: c.slug,
    description: c.description,
    instructor: c.instructor,
  }));
}

/**
 * Get course detail by slug
 */
export async function getCourseBySlug(slug: string): Promise<CourseData | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    if (error?.message?.includes('AbortError')) return null;
    console.error("Error fetching course detail:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    level: data.level || "Beginner",
    image: data.thumbnail_url || "https://placehold.co/800x450/ec4899/ffffff?text=Course",
    fillCount: data.fill_count || 0,
    hugCount: data.hug_count || 0,
    slug: data.slug,
    description: data.description,
    instructor: data.instructor,
  };
}

/**
 * Get all lessons for a course by its slug
 */
export async function getLessonsByCourseSlug(courseSlug: string) {
  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (!course) return [];

  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  if (error) {
    if (error.message?.includes('AbortError')) return [];
    console.error("Error fetching lessons:", error);
    return [];
  }

  return lessons.map((l: any) => ({
    id: l.id,
    title: l.title,
    duration: l.duration,
    level: l.level,
    videoCount: l.video_count,
    thumbnail: l.thumbnail_url || "https://placehold.co/400x225/ec4899/ffffff?text=Lesson",
    slug: l.slug,
    courseSlug: courseSlug,
  }));
}

/**
 * Get lesson details including videos
 */
export async function getLessonDetailBySlug(courseSlug: string, lessonSlug: string) {
  // We query lessons joining with courses to ensure the lesson belongs to the right course
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select(`
      *,
      courses!inner(slug),
      video_modules(*)
    `)
    .eq("slug", lessonSlug)
    .eq("courses.slug", courseSlug)
    .maybeSingle();

  if (error) {
    if (error.message?.includes('AbortError')) return null;
    console.error("Error fetching lesson detail:", error);
    return null;
  }

  if (!lesson) return null;

  return {
    id: lesson.id,
    title: lesson.title,
    slug: lesson.slug,
    description: lesson.description,
    image: lesson.thumbnail_url,
    courseId: lesson.course_id,
    videos: (lesson.video_modules || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((v: any) => ({
        id: v.id,
        title: v.title,
        duration: v.duration,
        youtubeUrl: v.youtube_url,
        videoUrl: v.video_url,
        order: v.sort_order,
        description: v.description,
        skillsGained: v.skills_gained,
        whatYouLearn: v.what_you_learn,
        thumbnail: v.thumbnail_url
      })),
  };
}