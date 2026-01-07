/** @format */

// app/event/[slug]/page.tsx
"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getEventDetailBySlug } from "@/lib/eventData";

export default function eventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventSlug = params.slug as string;

  // Get event detail from data
  const event = getEventDetailBySlug(eventSlug);

  // Default data if not found
  const eventData = event || {
    eventTitle: "Course Not Found",
    title: "event Not Found",
    description: "This event could not be found.",
    instructor: "Unknown",
    level: "Beginner",
    date: "-",
    time: "-",
    price: "N/A",
    enrolled: "N/A",
    image: "/images/default.jpg",
    aboutText: "event details not available.",
    whatYouLearn: [],
    skillGained: [],
  };

  const [expandedModules, setExpandedModules] = useState<string[]>(["1"]);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) =>
      prev.includes(id)
        ? prev.filter((moduleId) => moduleId !== id)
        : [...prev, id]
    );
  };

  const handleRegisterEvent = () => {
    // Store event data to localStorage for checkout page
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

    // Redirect to event checkout page
    router.push("/event-checkout");
  };

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-700 to-rose-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <span className="inline-block bg-gradient-to-r from-pink-100 to-pink-100 text-pink-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                {eventData.level}
              </span>
              <p className="text-4xl md:text-4xl font-bold leading-tight">
                {eventData.title}
              </p>
              <p className="text-lg text-white/90 leading-relaxed">
                {eventData.description}
              </p>
              <p className="text-white/80">
                <span className="font-semibold">Instructors:</span>{" "}
                {eventData.instructor}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleRegisterEvent}
                  className="bg-white text-rose-700 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Daftar Event
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
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
      <section className="py-10 px-4 mt-12">
        <div className="max-w-7xl mx-auto">
          {/* Stats Card */}
          <div className="max-w-7xl mx-auto -mt-6 grid grid-cols-1 md:grid-cols-4 gap-6 ">
            <div className="flex items-center gap-3 bg-[#F8F8FF] p-6 rounded-xl shadow-sm">
              <div className="bg-rose-100 p-3 rounded-full">
                <CircleDollarSign className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Harga</p>
                <p className="font-semibold">{eventData.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F8F8FF] p-6 rounded-xl shadow-sm">
              <div className="bg-rose-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Level</p>
                <p className="font-semibold">{eventData.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F8F8FF] p-6 rounded-xl shadow-sm">
              <div className="bg-rose-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tanggal</p>
                <p className="font-semibold">{eventData.date} </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F8F8FF] p-6 rounded-xl shadow-sm">
              <div className="bg-rose-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Durasi</p>
                <p className="font-semibold">{eventData.time}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-10 px-4 ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {eventData.aboutText}
          </p>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventData.whatYouLearn.map((item, index) => (
              <div key={index} className="flex gap-4">
                <Check className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Gained */}
      <section className="py-10 px-4 ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Skill You'll Gain
          </h2>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {eventData.skillGained.map((skill, index) => (
                <span
                  key={index}
                  className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
