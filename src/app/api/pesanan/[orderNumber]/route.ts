/** @format */
"use client";

// src/app/api/pesanan/[orderNumber]/route.ts
import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/service/member/pesanan";

export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const order = await getOrderByNumber(params.orderNumber);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
