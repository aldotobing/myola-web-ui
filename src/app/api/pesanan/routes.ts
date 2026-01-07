/** @format */
"use client";

import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/api/pesanan";

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
