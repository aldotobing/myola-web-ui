/** @format */

// src/lib/api/pesanan.ts (atau orders.ts)
// export async function getAllOrdersFromAPI(): Promise<Order[]> {
// //   try {
// //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
// //       method: 'GET',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${process.env.API_TOKEN}` // jika perlu auth
// //       },
// //       cache: 'no-store' // untuk Next.js, disable cache
// //     });

// //     if (!response.ok) {
// //       throw new Error('Failed to fetch orders');
// //     }

// //     const data = await response.json();
// //     return data.orders || [];
// //   } catch (error) {
// //     console.error('Error fetching orders from API:', error);
// //     return [];
// //   }
// }

// export async function getOrderByNumber(orderNumber: string) {
//   // function tetap sama
// }
import { Order } from "@/types/order";

const ordersData: Order[] = [
  {
    id: 1,
    orderNumber: "SM3719JDL0",
    date: "Sabtu, 18 Des 2025 - 20.34",
    status: "sedang_diproses",
    statusText: "Sedang Diproses",
    items: [
      {
        id: 1,
        name: "Hair Color Cream Brown Sugar",
        price: 200000,
        quantity: 2,
        image: "https://placehold.co/80x80/ec4899/ffffff?text=HC",
        cashback: 40000,
      },
    ],
    totalAmount: 400000,
    customerName: "Maria Klarasin",
    customerPhone: "089612756458",
    address:
      "Kauman Asri Gang 1 No. 7, Kelurahan Benowo, Kecamatan Pakai, RT 01 RW 06, Kota Surabaya 60195",
    paymentMethod: "QRIS",
    subtotal: 400000,
    redeemPoints: 0,
    totalPayment: 400000,
    ppn: 40000,
    shippingCost: 0,
    deliveryProof: "", // Example
  },
  {
    id: 2,
    orderNumber: "SM3719JDL1",
    date: "Sabtu, 18 Des 2025 - 20.34",
    status: "sedang_dikirim",
    statusText: "Sedang Dikirim",
    items: [
      {
        id: 1,
        name: "Hair Color Cream Brown Sugar",
        price: 200000,
        quantity: 2,
        image: "https://placehold.co/80x80/ec4899/ffffff?text=HC",
        cashback: 40000,
      },
    ],
    totalAmount: 400000,
    customerName: "Maria Klarasin",
    customerPhone: "089612756458",
    address:
      "Kauman Asri Gang 1 No. 7, Kelurahan Benowo, Kecamatan Pakai, RT 01 RW 06, Kota Surabaya 60195",
    paymentMethod: "QRIS",
    subtotal: 400000,
    redeemPoints: 0,
    totalPayment: 400000,
    ppn: 40000,
    shippingCost: 0,
    notification: {
      type: "info",
      message: "Klik Pesanan Diterima untuk konfirmasi 🎉",
    },
    deliveryProof: "", // Example
  },
  {
    id: 3,
    orderNumber: "SM37623892",
    date: "Sabtu, 18 Desember 2025 - 20.00",
    status: "selesai",
    statusText: "Selesai",
    items: [
      {
        id: 1,
        name: "Hair Color Cream Brown Sugar",
        price: 80000,
        quantity: 1,
        image: "https://placehold.co/80x80/ec4899/ffffff?text=HC",
        cashback: 20000,
      },
      {
        id: 2,
        name: "Hair Color Cream Red Sugar",
        price: 80000,
        quantity: 2,
        image: "https://placehold.co/80x80/ec4899/ffffff?text=HC",
        cashback: 40000,
      },
    ],
    totalAmount: 240000,
    customerName: "Maria Klarasin",
    customerPhone: "089612756458",
    address:
      "Kauman Asri Gang 1 No. 7, Kelurahan Benowo, Kecamatan Pakai, RT 01 RW 06, Kota Surabaya 60195",
    paymentMethod: "QRIS",
    subtotal: 240000,
    redeemPoints: 100000,
    totalPayment: 140000,
    ppn: 14000,
    shippingCost: 32000,
    notification: {
      type: "success",
      message: "Belanja lagi dan join member untuk mendapatkan cashback",
    },
    deliveryProof: "https://placehold.co/400x400/ec4899/ffffff?text=Proof", // Example
  },
];

export async function getAllOrders(): Promise<Order[]> {
  // Simulasi delay API
  await new Promise((resolve) => setTimeout(resolve, 500));
  return ordersData;
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  // Simulasi delay API
  await new Promise((resolve) => setTimeout(resolve, 500));
  const order = ordersData.find((o) => o.orderNumber === orderNumber);
  return order || null;
}

export async function confirmOrderDelivery(
  orderNumber: string,
  photoFile: File
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    // Simulasi delay API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Convert photo to base64 or upload to storage
    const photoUrl = await uploadDeliveryPhoto(photoFile);

    // Find and update order
    const orderIndex = ordersData.findIndex(
      (o) => o.orderNumber === orderNumber
    );

    if (orderIndex === -1) {
      return { success: false, error: "Order not found" };
    }

    // Update order status
    ordersData[orderIndex] = {
      ...ordersData[orderIndex],
      status: "selesai",
      statusText: "Selesai",
      deliveryProof: photoUrl,
      notification: {
        type: "success",
        message: "Belanja lagi dan join member untuk mendapatkan cashback",
      },
    };

    return { success: true, order: ordersData[orderIndex] };
  } catch (error) {
    return { success: false, error: "Failed to confirm delivery" };
  }
}

async function uploadDeliveryPhoto(file: File): Promise<string> {
  // For mock: convert to base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // For production: upload to cloud storage (S3, Cloudinary, etc.)
  // const formData = new FormData();
  // formData.append('file', file);
  // const response = await fetch('/api/upload', { method: 'POST', body: formData });
  // const { url } = await response.json();
  // return url;
}
