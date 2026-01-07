/** @format */

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

//Product Data
export const PRODUCT_DATA: ProductData[] = [
  {
    slug: "hair-color-cream-black-sugar",
    id: "1",
    name: "Hair Color Cream Black Sugar",
    price: "Rp 56.000",
    rating: 5.0,
    image: "/images/product_1.png",
    cashback: 10000,
    inStock: true,
  },
  {
    slug: "hair-color-cream-purple-sugar",
    id: "2",
    name: "Hair Color Cream Purple Sugar",
    price: "Rp 56.000",
    rating: 5.0,
    image: "/images/product_2.png",
    cashback: 10000,
    inStock: true,
  },
  {
    slug: "hair-color-cream-pink-sugar",
    id: "3",
    name: "Hair Color Cream Pink Sugar",
    price: "Rp 56.000",
    rating: 5.0,
    image: "/images/product_3.png",
    cashback: 10000,
    inStock: true,
  },
  {
    slug: "hair-color-cream-brown-sugar",
    id: "4",
    name: "Hair Color Cream Brown Sugar",
    price: "Rp 56.000",
    rating: 5.0,
    image: "/images/product_3.png",
    cashback: 10000,
    inStock: true,
  },
  {
    slug: "hair-color-cream-red-sugar",
    id: "5",
    name: "Hair Color Cream Red Sugar",
    price: "Rp 56.000",
    rating: 5.0,
    image: "/images/product_5.png",
    cashback: 10000,
    inStock: true,
  },
];

// Helper function to get product by slug
export function getProductBySlug(slug: string): ProductData | undefined {
  return PRODUCT_DATA.find((product) => product.slug === slug);
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
  images: string[]; // Multiple product images
  cashback: number;
  inStock: boolean;
  category: string;
  colorLabel?: string;
  description: string;
  reviews: ReviewData[];
}

// Product Data
export const PRODUCT_DETAIL_DATA: ProductDetailData[] = [
  {
    slug: "hair-color-cream-black-sugar",
    id: "1",
    name: "Hair Color Cream Black Sugar",
    price: "Rp 56.000",
    rating: 5.0,
    image: "/images/product_1.png",
    images: [
      "/images/product_1.png",
      "/images/product_2.png",
      "/images/product_3.png",
      "/images/product_1.png",
    ],
    cashback: 10000,
    inStock: true,
    category: "Pewarna Rambut",
    colorLabel: "BLUE",
    description:
      "Shiseido Japan Hair Color is a professional-grade hair dye that delivers vibrant, long-lasting color while nourishing and strengthening your hair. Its unique formula includes natural ingredients that protect and maintain hair's natural shine and texture, making it suitable for all hair types and ideal for achieving salon-quality results at home. natural shine and texture, making it suitable for all hair types and ideal for achieving salon-quality results at home. natural shine and texture, making it suitable for all hair types and ideal for achieving salon-quality results at home.",
    reviews: [
      {
        id: "1",
        productId: "1",
        userName: "Taylor Swift",
        userAvatar: "/images/avatar-1.jpg",
        rating: 5.0,
        date: "Sabtu, 16 Agustus 2025",
        title: "amazing color, easy clean up!",
        comment:
          "I got it off Amazon since my parents don't trust anything else but I loved it! loved the color and how it turned out. it got everywhere in the shower and didn't stain as much as we thought it would! 10/10 would buy again",
      },
      {
        id: "2",
        productId: "1",
        userName: "Thaniyah Meriaka",
        userAvatar: "/images/avatar-2.jpg",
        rating: 5.0,
        date: "Sabtu, 16 Agustus 2025",
        title: "amazing color, easy clean up!",
        comment:
          "I got it off Amazon since my parents don't trust anything else but I loved it! loved the color and how it turned out. it got everywhere in the shower and didn't stain as much as we thought it would! 10/10 would buy again",
      },
      {
        id: "3",
        productId: "1",
        userName: "Sabrina Carp",
        userAvatar: "/images/avatar-3.jpg",
        rating: 5.0,
        date: "Sabtu, 16 Agustus 2025",
        title: "amazing color, easy clean up!",
        comment:
          "I got it off Amazon since my parents don't trust anything else but I loved it! loved the color and how it turned out. it got everywhere in the shower and didn't stain as much as we thought it would! 10/10 would buy again",
      },
    ],
  },
  {
    slug: "hair-color-cream-purple-sugar",
    id: "2",
    name: "Hair Color Cream Purple Sugar",
    price: "Rp 56.000",
    rating: 5.0,
    image: "/images/product_1.png",
    images: ["/images/product_1.png"],
    cashback: 10000,
    inStock: true,
    category: "Pewarna Rambut",
    colorLabel: "BLACK",
    description:
      "Professional hair color cream with rich black color and sugar-infused formula for healthy, shiny hair.",
    reviews: [],
  },
  {
    slug: "hair-color-cream-brown-sugar",
    id: "4",
    name: "Hair Color Cream Brown Sugar",
    price: "Rp 56.000",
    rating: 5.0,
    image: "/images/product_2.png",
    images: ["/images/product_2.png"],
    cashback: 10000,
    inStock: true,
    category: "Pewarna Rambut",
    colorLabel: "PURPLE",
    description:
      "Vibrant purple hair color with nourishing formula that protects and maintains hair health.",
    reviews: [],
  },
];

// Helper function to get product detail by slug
export function getProductDetailBySlug(
  slug: string
): ProductDetailData | undefined {
  return PRODUCT_DETAIL_DATA.find((product) => product.slug === slug);
}

// Helper function to get reviews by product ID
export function getReviewsByProductId(productId: string): ReviewData[] {
  const product = PRODUCT_DETAIL_DATA.find((p) => p.id === productId);
  return product?.reviews || [];
}

// Helper function to calculate average rating
export function calculateAverageRating(productId: string): number {
  const reviews = getReviewsByProductId(productId);
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
}
