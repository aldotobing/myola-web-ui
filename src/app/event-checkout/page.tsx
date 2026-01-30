/** @format */

// app/event-checkout/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { isMemberActive, useAuth } from "@/app/contexts/AuthContexts";
import { getUserAddresses } from "@/lib/service/member/addresses";
import { Address } from "@/types/address";
import AddressFormModal from "@/components/addresses/AddressFormModal";
import { createAddress } from "@/lib/service/member/addresses";
import { AddressFormData } from "@/types/address";
import Link from "next/link";
import { Calendar, Clock, CircleDollarSign, User, Loader2 } from "lucide-react";

interface EventData {
  eventTitle: string;
  title: string;
  description: string;
  instructor: string;
  level: string;
  date: string;
  time: string;
  price: string;
  image: string;
  slug: string;
}

function EventCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const isLoggedIn = !!user;
  const isMember = isLoggedIn && (isMemberActive(user?.memberUntil) || user?.role === 'admin');

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    phoneNumber: "",
    idCardNumber: "",
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [useExistingAddress, setUseExistingAddress] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressModalLoading, setAddressModalLoading] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(0);

  useEffect(() => {
    const storedEvent = localStorage.getItem("event_checkout_data");
    if (storedEvent) {
      setEventData(JSON.parse(storedEvent));
    } else {
      router.push("/");
      return;
    }

    if (isLoggedIn) {
      loadAddresses();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await getUserAddresses();
      setAddresses(data);
      const primary = data.find((addr) => addr.isPrimary);
      if (primary) setSelectedAddress(primary);
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (data: AddressFormData) => {
    setAddressModalLoading(true);
    try {
      const result = await createAddress(data);
      if (result.success && result.address) {
        await loadAddresses();
        setSelectedAddress(result.address);
        setShowAddressModal(false);
      }
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setAddressModalLoading(false);
    }
  };

  const parsePrice = (priceString: string): number => {
    if (priceString.toLowerCase().includes("gratis")) return 0;
    const numericPrice = priceString.replace(/[^0-9]/g, "");
    return parseInt(numericPrice) || 0;
  };

  const eventPrice = eventData ? parsePrice(eventData.price) : 0;
  const totalAfterRedeem = Math.max(0, eventPrice - redeemPoints);
  const ppn = Math.round(totalAfterRedeem * 0.11);
  const totalBayar = totalAfterRedeem + ppn;

  const handleRedeemChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    const userPoints = user?.points_balance || 0;
    const maxRedeem = Math.min(userPoints, eventPrice);
    setRedeemPoints(Math.min(numValue, maxRedeem));
  };

  const handlePayment = async () => {
    if (!registrationData.fullName.trim()) return alert("Silakan isi nama lengkap");
    if (registrationData.phoneNumber.length < 10) return alert("Nomor HP tidak valid");
    if (!registrationData.idCardNumber.trim()) return alert("Silakan isi Nomor KTP");

    if (!eventData) return;

    setLoading(true);
    try {
      // 1. Create event order in database
      const response = await fetch("/api/member/events/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: (eventData as any).id,
          customerName: registrationData.fullName,
          customerPhone: registrationData.phoneNumber,
          customerEmail: user?.email,
          subtotal: eventPrice,
          redeemPoints: redeemPoints,
          totalPayment: totalBayar,
          paymentMethod: "QRIS",
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create event order");

      // 2. Store payment data for selection page
      const paymentData = {
        type: "event",
        orderNumber: result.orderNumber,
        event: eventData,
        registration: registrationData,
        eventPrice,
        redeemPoints,
        totalBayar,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("payment_data", JSON.stringify(paymentData));
      router.push("/payment/select");
    } catch (error: any) {
      alert("Gagal memproses pendaftaran: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pendaftaran Event</h1>

        {!isLoggedIn && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="font-semibold text-blue-900">Login untuk pengalaman lebih baik</p>
            <Link href="/auth/login?redirect=/event-checkout" className="text-blue-600 hover:underline">Login Sekarang →</Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Rincian Event</h2>
              <div className="flex gap-4 pb-4">
                <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={eventData.image} alt={eventData.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{eventData.title}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><User size={14} /> {eventData.instructor}</div>
                    <div className="flex items-center gap-2"><Calendar size={14} /> {eventData.date}</div>
                    <div className="flex items-center gap-2"><CircleDollarSign size={14} /> <span className="text-pink-500 font-bold">{eventData.price}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Pendaftaran</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Nama Lengkap" value={registrationData.fullName} onChange={(e) => setRegistrationData({...registrationData, fullName: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-pink-500 outline-none" />
                <input type="tel" placeholder="Nomor HP" value={registrationData.phoneNumber} onChange={(e) => setRegistrationData({...registrationData, phoneNumber: e.target.value})} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-pink-500 outline-none" />
                <input type="text" placeholder="Nomor KTP" value={registrationData.idCardNumber} onChange={(e) => setRegistrationData({...registrationData, idCardNumber: e.target.value})} maxLength={16} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-pink-500 outline-none" />
              </div>
            </div>

            {isLoggedIn && (
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Redeem Poin</h2>
                <div className="bg-pink-50 p-4 rounded-xl">
                   <p className="font-bold mb-2">Kamu punya {user.points_balance?.toLocaleString()} Poin</p>
                   <input type="number" value={redeemPoints || ""} onChange={(e) => handleRedeemChange(e.target.value)} placeholder="Jumlah poin" className="w-full px-4 py-2 border-2 border-white rounded-lg" />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span>Harga</span><span>Rp {eventPrice.toLocaleString()}</span></div>
                {redeemPoints > 0 && <div className="flex justify-between text-pink-600"><span>Redeem</span><span>- {redeemPoints.toLocaleString()}</span></div>}
                <div className="flex justify-between font-bold border-t pt-3"><span>Total Bayar</span><span className="text-pink-500">Rp {totalBayar.toLocaleString()}</span></div>
              </div>
              <button onClick={handlePayment} className="w-full bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 shadow-lg">Bayar Sekarang</button>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <AddressFormModal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} onSubmit={handleAddressSubmit} isLoading={addressModalLoading} isEdit={false} />
      )}
    </div>
  );
}

export default function EventCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    }>
      <EventCheckoutContent />
    </Suspense>
  );
}