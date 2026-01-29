/** @format */

import { Course, Video } from "@/types/kelas";
import { createClient as getSupabase } from "@/utils/supabase/client";

/**
 * Get all courses for a user with their progress
 */
export async function getUserCourses(
  userId?: string
): Promise<Course[]> {
  const supabase = getSupabase();
  
  // If no userId provided, try to get from current session
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    userId = user.id;
  }

  // 1. Fetch all active courses
  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
    return [];
  }

  // 2. Fetch user enrollments
  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("user_id", userId);

  if (!enrollments || enrollments.length === 0) return [];

  // 3. For each enrollment, fetch course details and progress
  const enrolledCourses = await Promise.all(
    enrollments.map(async (enrollment) => {
      // Get course basic info
      const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", enrollment.course_id)
        .single();

      if (!course) return null;
      
      // Fetch all videos for this course (via lessons)
      const { data: videosData } = await supabase
        .from("video_modules")
        .select(`
          *,
          lessons!inner(course_id)
        `)
        .eq("lessons.course_id", course.id)
        .order("sort_order", { ascending: true });

      // Fetch user's completed videos for this course
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
  const supabase = getSupabase();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    userId = user.id;
  }

  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (error || !course) return null;

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  const { data: videosData } = await supabase
    .from("video_modules")
    .select(`
      *,
      lessons!inner(course_id)
    `)
    .eq("lessons.course_id", courseId)
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
}

/**
 * Mark a video as completed
 */
export async function completeVideo(
  courseId: string,
  videoId: string,
  userId?: string
): Promise<{
  success: boolean;
  course?: Course;
  nextVideo?: Video;
  error?: string;
}> {
  const supabase = getSupabase();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };
    userId = user.id;
  }

  try {
    // 1. Mark video as completed in course_progress
    const { error: progressError } = await supabase
      .from("course_progress")
      .upsert({
        user_id: userId,
        video_module_id: videoId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,video_module_id' });

    if (progressError) throw progressError;

    // 2. Update course enrollment status if it was 'not_started'
    const { data: enrollment } = await supabase
      .from("course_enrollments")
      .select("status")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (enrollment && enrollment.status === 'not_started') {
      await supabase
        .from("course_enrollments")
        .update({ status: 'in_progress', started_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("course_id", courseId);
    }

    // 3. Get updated course data
    const updatedCourse = await getCourseById(courseId, userId);
    if (!updatedCourse) throw new Error("Course not found");

    // 4. Check if all videos are completed
    if (updatedCourse.completedVideos === updatedCourse.totalVideos) {
      await supabase
        .from("course_enrollments")
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("course_id", courseId);
      updatedCourse.status = 'completed';
    }

    // 5. Find next video
    const currentVideoIndex = updatedCourse.videos.findIndex(v => v.id === videoId);
    const nextVideo = updatedCourse.videos[currentVideoIndex + 1] || undefined;

    return {
      success: true,
      course: updatedCourse,
      nextVideo,
    };
  } catch (error: any) {
    console.error("Error completing video:", error);
    return { success: false, error: error.message };
  }
}

export async function getCoursesByStatus(
  status: "in_progress" | "completed",
  userId?: string
): Promise<Course[]> {
  const allCourses = await getUserCourses(userId);
  return allCourses.filter((course) => course.status === status);
}

export async function getNextVideo(
  courseId: string,
  userId?: string
): Promise<Video | null> {
  const course = await getCourseById(courseId, userId);
  if (!course) return null;
  return course.videos.find((video) => !video.completed) || null;
}

export async function getCurrentVideo(
  courseId: string,
  userId?: string
): Promise<Video | null> {
  const course = await getCourseById(courseId, userId);
  if (!course) return null;
  
  // Try to find the first uncompleted video, or return the last video if all completed
  return course.videos.find((v) => !v.completed) || course.videos[course.videos.length - 1] || null;
}
