"use client";

import { useState, memo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type Testimonial = {
  id: string;
  name: string;
  title: string;
  company: string;
  quote: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "[CLIENT NAME]",
    title: "[Job Title]",
    company: "[Company Name]",
    quote:
      "[Add client testimonial quote here — focus on business impact, speed, technical expertise, or reliability. Keep it 2-3 sentences.]",
    image: "/images/testimonial-placeholder.jpg",
  },
  {
    id: "2",
    name: "[CLIENT NAME 2]",
    title: "[Job Title]",
    company: "[Company Name]",
    quote:
      "[Add second client testimonial quote — different industry or use case preferred.]",
    image: "/images/testimonial-placeholder.jpg",
  },
];

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () =>
    setCurrent((current - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative">
      <div className="relative max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-0 relative"
          >
            {/* Navigation - Left Arrow */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20 z-20 p-2 hover:opacity-70 transition-opacity"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={28} className="text-gray-700 md:text-gray-400" />
            </button>

            {/* Profile Image - Left Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center md:justify-start">
              <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-3xl overflow-hidden bg-linear-to-br from-amber-200 to-amber-100 flex items-center justify-center shadow-lg">
                {testimonial.image && testimonial.image !== "/images/testimonial-placeholder.jpg" ? (
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    priority={current === 0}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/30 text-center">
                    <svg
                      className="w-20 h-20 mb-3 opacity-40"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <p className="text-xs font-medium">[Client Photo]</p>
                  </div>
                )}
              </div>
            </div>

            {/* Testimonial Card - Right Side (Overlapping) */}
            <div className="w-full md:w-1/2 flex items-center md:-ml-20 lg:-ml-24 z-10 mt-8 md:mt-0">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="w-full bg-neutral-900 rounded-3xl p-8 md:p-10 lg:p-12 shadow-2xl"
              >
                {/* Name */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                  {testimonial.name}
                </h3>

                {/* Title & Company */}
                <div className="mb-6">
                  <p className="text-gray-400 text-sm md:text-base">
                    {testimonial.title}
                  </p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                </div>

                {/* Quote */}
                <p className="text-white text-base md:text-lg leading-relaxed mb-8">
                  {testimonial.quote}
                </p>

                {/* Social Icons - Bottom */}
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                    aria-label="GitHub"
                  >
                    <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                    aria-label="Twitter"
                  >
                    <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 5-7 9" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.25-.129.599-.129.948v5.419h-3.554s.05-8.035 0-8.874h3.554v1.256c.394-.606 1.299-1.47 3.161-1.47 2.309 0 4.038 1.513 4.038 4.747v4.341zM5.337 8.855c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.958-1.715 1.187 0 1.927.762 1.958 1.715 0 .953-.771 1.715-1.958 1.715zm1.581 11.597H3.635V8.578h3.283v11.874zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Navigation - Right Arrow */}
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20 z-20 p-2 hover:opacity-70 transition-opacity"
              aria-label="Next testimonial"
            >
              <ChevronRight size={28} className="text-gray-700 md:text-gray-400" />
            </button>
          </motion.div>
        </AnimatePresence>

        {/* See Similar - Bottom Center */}
        {testimonials.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-12 text-gray-600 text-sm"
          >
            <span>See similar</span>
            <ChevronDown size={16} className="opacity-50" />
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default memo(TestimonialCarousel);
