'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getAllBreedImages } from '@/actions/actions'; // 新增的 Server Action

export default function BackgroundCarousel() {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // 獲取所有圖片
    async function fetchImages() {
      const res = await getAllBreedImages(); // 假設返回 { data: string[] }
      const validImages = res.data.filter(
        (image: string) => image && image !== ''
      );
      setImages(validImages);
    }
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) {
    return <div className="absolute inset-0 z-10 bg-gray-300" />;
  }

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
