'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BannerSlide } from '@/types';

interface HeroBannerProps {
  slides: BannerSlide[];
  autoPlayInterval?: number;
}

/**
 * Banner principal con carrusel de slides
 * Incluye autoplay, controles de navegacion y indicadores
 */
export function HeroBanner({
  slides,
  autoPlayInterval = 7000,
}: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Autoplay
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, goToNext, autoPlayInterval, slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-banner min-h-[360px] sm:min-h-[440px] max-h-[680px] overflow-hidden bg-surface"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            className="object-cover scale-[1.01]"
            priority
            unoptimized
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.96)_0%,rgba(9,8,7,0.72)_38%,rgba(9,8,7,0.18)_72%),linear-gradient(180deg,rgba(9,8,7,0.15)_0%,rgba(9,8,7,0.62)_100%)]" />

          {/* Content */}
          <div className="container-custom h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
              className="max-w-xl px-2 sm:px-0"
            >
              {currentSlide.subtitle && (
                <div className="mb-2 sm:mb-3 flex items-center gap-3 text-accent-muted">
                  <span className="h-px w-8 bg-brand-red" />
                  <p className="text-xs sm:text-sm lg:text-base uppercase">
                    {currentSlide.subtitle}
                  </p>
                </div>
              )}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[0.98] mb-4 sm:mb-5 text-balance">
                {currentSlide.title}
              </h1>
              {currentSlide.buttonText && (
                <Link
                  href={currentSlide.link}
                  className="btn-primary text-sm sm:text-base px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 inline-flex"
                >
                  {currentSlide.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows - ocultos en mobile pequeño */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 hidden sm:flex items-center justify-center rounded-full bg-background/55 backdrop-blur-md border border-accent/15 shadow-inner-light hover:bg-background/80 transition-colors"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 hidden sm:flex items-center justify-center rounded-full bg-background/55 backdrop-blur-md border border-accent/15 shadow-inner-light hover:bg-background/80 transition-colors"
            aria-label="Siguiente slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-1.5 sm:h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-6 sm:w-8 bg-accent'
                  : 'w-1.5 sm:w-2 bg-accent/35 hover:bg-accent/60'
              )}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
