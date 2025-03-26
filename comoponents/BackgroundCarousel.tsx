// components/BackgroundCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundCarouselProps {
  images: string[];
}

export default function BackgroundCarousel({
  images,
}: BackgroundCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 z-10">
      <Image
        src={images[currentImageIndex]}
        alt="Background dog image"
        fill
        className="object-cover transition-opacity duration-500 ease-in-out"
      />
      <div className="absolute inset-0 bg-black/30 z-20" />
    </div>
  );
}
