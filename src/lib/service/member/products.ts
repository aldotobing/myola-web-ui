/** @format */

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export interface ProductData {
  slug: string;
  id: string;
  name: string;
  price: string;
  rating: number;
  image: string;
  cashback: number;
  inStock: boolean;
}

export interface ReviewData {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export interface ProductDetailData {
  slug: string;
  id: string;
  name: string;
  price: string;
  rating: number;
  image: string;
  images: string[];
  cashback: number;
  inStock: boolean;
  category: string;
  colorLabel?: string;
  description: string;
  reviews: ReviewData[];
}

/**
 * Get all products from Supabase
 */
export async function getAllProducts(): Promise<ProductData[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_categories(name),
      product_images(*)
    `)
    .eq("is_active", true);

  if (error) {
    if (error.message?.includes('AbortError')) return [];
    console.error("Error fetching products:", error);
    return [];
  }

  return data.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: `Rp ${Number(p.price).toLocaleString('id-ID')}`,
    rating: Number(p.rating || 0),
    image: p.product_images?.find((img: any) => img.is_primary)?.image_url || "/images/product_1.png",
    cashback: p.cashback_points || 0,
    inStock: p.stock > 0,
  }));
}

/**
 * Get product detail by slug
 */
export async function getProductDetailBySlug(
  slug: string
): Promise<ProductDetailData | null> {
  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      product_categories(name),
      product_images(*),
      product_reviews(
        *,
        profiles(full_name, avatar_url)
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !product) {
    if (error?.message?.includes('AbortError')) return null;
    console.error("Error fetching product detail:", error);
    return null;
  }

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: `Rp ${Number(product.price).toLocaleString('id-ID')}`,
    rating: Number(product.rating || 0),
    image: product.product_images?.find((img: any) => img.is_primary)?.image_url || "/images/product_1.png",
    images: product.product_images?.map((img: any) => img.image_url) || [],
    cashback: product.cashback_points || 0,
    inStock: product.stock > 0,
    category: product.product_categories?.name || "General",
    colorLabel: product.color_label,
    description: product.description || "",
    reviews: product.product_reviews?.map((r: any) => ({
      id: r.id,
      productId: r.product_id,
      userName: r.profiles?.full_name || "Anonymous",
      userAvatar: r.profiles?.avatar_url || "/images/avatar-default.jpg",
      rating: r.rating,
      date: new Date(r.created_at).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      title: r.title || "",
      comment: r.comment || "",
    })) || [],
  };
}

/**
 * Submit a product review
 */
export async function submitProductReview(review: {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("product_reviews")
    .insert({
      product_id: review.productId,
      user_id: user.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      is_approved: true // Auto-approve for now, or set to false for moderation
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}