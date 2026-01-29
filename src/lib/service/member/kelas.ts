/** @format */

import { Course, Video } from "@/types/kelas";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

/**
 * Get all courses for a user with their progress
 */
export async function getUserCourses(
  userId?: string
): Promise<Course[]> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    userId = user.id;
  }

  // 1. Fetch user enrollments
  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("user_id", userId);

  if (!enrollments || enrollments.length === 0) return [];

  // 2. For each enrollment, fetch course details and progress
  const enrolledCourses = await Promise.all(
    enrollments.map(async (enrollment) => {
      const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", enrollment.course_id)
        .maybeSingle();

      if (!course) return null;
      
      const { data: videosData } = await supabase
        .from("video_modules")
        .select(`*, lessons!inner(course_id)`)
        .eq("lessons.course_id", course.id)
        .order("sort_order", { ascending: true });

      const { data: progressData } = await supabase
        .from("course_progress")
        .select("video_module_id, is_completed")
        .eq("user_id", userId)
        .eq("is_completed", true);

      const completedVideoIds = new Set(progressData?.map(p => p.video_module_id) || []);

      const videos: Video[] = (videosData || []).map((v) => ({
        id: v.id,
        title: v.title,
        duration: v.duration || "0 menit",
        youtubeUrl: v.youtube_url || "",
        completed: completedVideoIds.has(v.id),
        order: v.sort_order || 0,
      }));

      const totalVideos = videos.length;
      const completedVideos = videos.filter(v => v.completed).length;
      const progress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

      return {
        id: course.id,
        title: course.title,
        instructor: course.instructor || "Instructor",
        thumbnail: course.thumbnail_url || "https://placehold.co/800x450/ec4899/ffffff?text=Course",
        description: course.description || "",
        skillsGained: course.skills_gained || [],
        totalVideos,
        completedVideos,
        progress,
        enrolledDate: enrollment?.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-",
        startDate: enrollment?.started_at ? new Date(enrollment.started_at).toISOString() : undefined,
        status: (enrollment?.status as Course["status"]) || "not_started",
        videos,
      };
    })
  );

  return enrolledCourses.filter(c => c !== null) as Course[];
}

/**
 * Get a single course by ID
 */
export async function getCourseById(
  courseId: string,
  userId?: string
): Promise<Course | null> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const { data: course, error } = await supabase.from("courses").select("*").eq("id", courseId).maybeSingle();
  if (error || !course) return null;

  const { data: enrollment } = await supabase.from("course_enrollments").select("*").eq("user_id", userId).eq("course_id", courseId).maybeSingle();

  const { data: videosData } = await supabase.from("video_modules").select(`*, lessons!inner(course_id)`).eq("lessons.course_id", courseId).order("sort_order", { ascending: true });

  const { data: progressData } = await supabase.from("course_progress").select("video_module_id, is_completed").eq("user_id", userId).eq("is_completed", true);

  const completedVideoIds = new Set(progressData?.map(p => p.video_module_id) || []);

  const videos: Video[] = (videosData || []).map((v) => ({
    id: v.id,
    title: v.title,
    duration: v.duration || "0 menit",
    youtubeUrl: v.youtube_url || "",
    completed: completedVideoIds.has(v.id),
    order: v.sort_order || 0,
  }));

  const totalVideos = videos.length;
  const completedVideos = videos.filter(v => v.completed).length;
  const progress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return {
    id: course.id,
    title: course.title,
    instructor: course.instructor || "Instructor",
    thumbnail: course.thumbnail_url || "https://placehold.co/800x450/ec4899/ffffff?text=Course",
    description: course.description || "",
    skillsGained: course.skills_gained || [],
    totalVideos,
    completedVideos,
    progress,
    enrolledDate: enrollment?.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-",
    startDate: enrollment?.started_at ? new Date(enrollment.started_at).toISOString() : undefined,
    status: (enrollment?.status as Course["status"]) || "not_started",
    videos,
  };
}

/**
 * Mark a video as completed
 */
export async function completeVideo(
  courseId: string,
  videoId: string,
  userId?: string
): Promise<{ success: boolean; course?: Course; nextVideo?: Video; error?: string; }> {
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };
    userId = user.id;
  }

  try {
    const { error: progressError } = await supabase.from("course_progress").upsert({
      user_id: userId, video_module_id: videoId, is_completed: true, completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,video_module_id' });

    if (progressError) throw progressError;

    const { data: enrollment } = await supabase.from("course_enrollments").select("status").eq("user_id", userId).eq("course_id", courseId).maybeSingle();

    if (enrollment && enrollment.status === 'not_started') {
      await supabase.from("course_enrollments").update({ status: 'in_progress', started_at: new Date().toISOString() }).eq("user_id", userId).eq("course_id", courseId);
    }

    const updatedCourse = await getCourseById(courseId, userId);
    if (!updatedCourse) throw new Error("Course not found");

    if (updatedCourse.completedVideos === updatedCourse.totalVideos) {
      await supabase.from("course_enrollments").update({ status: 'completed', completed_at: new Date().toISOString() }).eq("user_id", userId).eq("course_id", courseId);
      updatedCourse.status = 'completed';
    }

    const currentVideoIndex = updatedCourse.videos.findIndex(v => v.id === videoId);
    const nextVideo = updatedCourse.videos[currentVideoIndex + 1] || undefined;

    return { success: true, course: updatedCourse, nextVideo };
  } catch (error: any) {
    if (error.message?.includes('AbortError')) return { success: false };
    console.error("Error completing video:", error);
    return { success: false, error: error.message };
  }
}