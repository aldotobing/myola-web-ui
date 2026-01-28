/** @format */

import { createClient as getSupabase } from "@/utils/supabase/client";

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

/**
 * Get all events from Supabase
 */
export async function getAllEvents(): Promise<EventData[]> {
  const supabase = getSupabase();
  
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data.map((e: any) => ({
    id: e.id,
    title: e.title,
    image: e.image_url || "/images/kelas_1.png",
    date: new Date(e.event_date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: `${e.start_time?.slice(0, 5)} ${e.timezone || "WIB"}`,
    category: e.category || "EVENT",
    slug: e.slug,
  }));
}

/**
 * Get event detail by slug
 */
export async function getEventDetailBySlug(
  slug: string
): Promise<EventDetail | null> {
  const supabase = getSupabase();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !event) {
    console.error("Error fetching event detail:", error);
    return null;
  }

  return {
    slug: event.slug,
    eventTitle: event.title,
    title: event.title,
    description: event.description || "",
    instructor: event.instructor || "Expert",
    level: event.level || "All Levels",
    date: new Date(event.event_date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: `${event.start_time?.slice(0, 5)} - ${event.end_time?.slice(0, 5)} ${event.timezone || "WIB"}`,
    enrolled: event.sold_count > 0 ? `${event.sold_count} participants` : "Be the first to join!",
    image: event.image_url || "/images/thumb.jpg",
    price: `Rp ${Number(event.price).toLocaleString('id-ID')}`,
    aboutText: event.about_text || "",
    whatYouLearn: event.what_you_learn || [],
    skillGained: event.skills_gained || [],
  };
}
