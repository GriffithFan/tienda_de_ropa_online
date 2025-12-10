'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { announcements } from '@/data/products';
import { cn } from '@/lib/utils';

/**
 * Cinta de anuncios animada que se desplaza horizontalmente
 * Muestra informacion importante como envios, descuentos, ofertas
 */
export function AnnouncementBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const activeAnnouncements = announcements.filter((a) => a.isActive);
  
  // Duplicamos el contenido para crear el efecto de loop infinito
  const duplicatedAnnouncements = [...activeAnnouncements, ...activeAnnouncements];

  return (
    <div className="relative w-full bg-accent text-background overflow-hidden">
      <div className="h-7 flex items-center">
        <div
          ref={containerRef}
          className="flex animate-slide-left whitespace-nowrap"
        >
          {duplicatedAnnouncements.map((announcement, index) => (
            <AnnouncementItem
              key={`${announcement.id}-${index}`}
              text={announcement.text}
              link={announcement.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AnnouncementItemProps {
  text: string;
  link?: string;
}

function AnnouncementItem({ text, link }: AnnouncementItemProps) {
  const content = (
    <span className="inline-flex items-center gap-2 px-6 text-xs font-medium tracking-wide">
      <span className="w-1 h-1 rounded-full bg-background/50" />
      {text}
    </span>
  );

  if (link) {
    return (
      <Link
        href={link}
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
}
