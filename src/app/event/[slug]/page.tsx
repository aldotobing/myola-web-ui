/** @format */

// app/event/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  BookOpen,
  PlayCircle,
  Clock,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getEventDetailBySlug } from "@/lib/service/member/event-catalog";

export default function eventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventSlug = params.slug as string;

  const [eventData, setEventData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      const data = await getEventDetailBySlug(eventSlug);
      setEventData(data);
      setIsLoading(false);
    };
    fetchEvent();
  }, [eventSlug]);

  const handleRegisterEvent = () => {
    if (!eventData) return;
    
    const checkoutData = {
      eventTitle: eventData.eventTitle,
      title: eventData.title,
      description: eventData.description,
      instructor: eventData.instructor,
      level: eventData.level,
      date: eventData.date,
      time: eventData.time,
      price: eventData.price,
      image: eventData.image,
      slug: eventSlug,
    };

    localStorage.setItem("event_checkout_data", JSON.stringify(checkoutData));
    router.push("/event-checkout");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-500 mb-4">Event tidak ditemukan</p>
          <button onClick={() => router.push('/event')} className="text-pink-500 font-bold hover:underline">Kembali ke Event</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-700 to-rose-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                {eventData.level}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {eventData.title}
              </h1>
              <p className="text-lg text-rose-50 leading-relaxed">
                {eventData.description}
              </p>
              <p className="text-rose-200">
                <span className="font-semibold text-white">Instructors:</span>{" "}
                {eventData.instructor}
              </p>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleRegisterEvent}
                  className="bg-white text-rose-700 font-bold px-10 py-4 rounded-xl hover:bg-rose-50 transition-all shadow-xl"
                >
                  Daftar Event Sekarang
                </button>
              </div>
            </div>

            <div className="relative h-80 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <Image
                src={eventData.image}
                alt={eventData.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: CircleDollarSign, label: "Harga", value: eventData.price },
            { icon: BookOpen, label: "Level", value: eventData.level },
            { icon: Calendar, label: "Tanggal", value: eventData.date },
            { icon: Clock, label: "Durasi", value: eventData.time }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Tentang Event</h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {eventData.aboutText}
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Apa yang akan Anda pelajari?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventData.whatYouLearn.map((item: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="bg-green-100 p-1 rounded-full h-fit mt-1"><Check className="w-4 h-4 text-green-600" /></div>
                  <p className="text-gray-600 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Tambahan</h3>
            <div className="space-y-6 mb-8">
               <div>
                  <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-widest">Skill You'll Gain</h4>
                  <div className="flex flex-wrap gap-2">
                    {eventData.skillGained.map((skill: any, index: number) => (
                      <span key={index} className="bg-pink-50 text-pink-600 px-4 py-2 rounded-lg text-sm font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
            <button onClick={handleRegisterEvent} className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-100">
              Daftar Sekarang
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}