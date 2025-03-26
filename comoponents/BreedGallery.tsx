'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const BreedGallery = ({
  images,
  breedName,
}: {
  images: string[];
  breedName: string;
}) => {
  /* 選取的圖片 */
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /* 輪播功能的index */
  const [currentIndex, setCurrentIndex] = useState(0);

  /* 儲存佈局：哪些圖片是雙倍高度的index array */
  const [doubleHeightIndices, setDoubleHeightIndices] = useState<number[]>([]);

  /* 觸發動畫的狀態，記錄前一個索引以判斷方向 */
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  /* 初始化時從 localStorage 載入佈局，或生成新佈局 */
  useEffect(() => {
    const storedLayout = localStorage.getItem(`galleryLayout_${breedName}`);
    if (storedLayout) {
      /* 如果 localStorage 有儲存的佈局，直接使用 */
      setDoubleHeightIndices(JSON.parse(storedLayout));
    } else {
      /* 若否，隨機生成雙倍高度圖片的索引（每 5 張隨機 1 張）*/
      const newDoubleHeightIndices: number[] = [];
      for (let i = 0; i < images.length; i += 5) {
        const randomIndex =
          i + Math.floor(Math.random() * Math.min(5, images.length - i));
        newDoubleHeightIndices.push(randomIndex);
      }
      /* 設定佈局狀態 */
      setDoubleHeightIndices(newDoubleHeightIndices);

      /* 儲存到 localStorage */
      localStorage.setItem(
        `galleryLayout_${breedName}`,
        JSON.stringify(newDoubleHeightIndices)
      );
    }
  }, [images, breedName]);

  /* 點擊圖片放大，更新index位置，重置動畫鍵值，確保初次點擊也有動畫 */
  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setPrevIndex(null); // 初次點擊時沒有前一個索引
  };

  /* 關閉放大的圖片 */
  const handleClose = () => {
    setSelectedImage(null);
    setPrevIndex(null); // 關閉時重置 prevIndex
  };

  /* 放大檢視時切換至下一張 */
  const handleNextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setPrevIndex(currentIndex); // 記錄當前索引作為前一個索引
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  /* 放大檢視時切換至上一張 */
  const handlePrevImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setPrevIndex(currentIndex); // 記錄當前索引作為前一個索引
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  /* variants: 定義framer-motion的動畫變體 */
  const imageVariants = {
    /* 圖片初始狀態，從motion.div的custom參數傳方向過來，決定圖片從哪個方向進入 */
    hidden: (direction: 'left' | 'right' | 'none') => ({
      opacity: 0, // 初始透明度完全透明
      x: direction === 'right' ? '100%' : direction === 'left' ? '-100%' : 0, // 進入時初始位置
    }),
    /* 圖片顯示時的狀態 */
    visible: {
      opacity: 1, // 完全不透明
      x: 0, // 最終位置
      /* hidden 到 visible 的過渡動畫 */
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    /* 圖片結束時的狀態，舊圖片在退出時滑出 */
    exit: (direction: 'left' | 'right' | 'none') => ({
      opacity: 0,
      x: direction === 'right' ? '-100%' : direction === 'left' ? '100%' : 0, // 退出時結束位置
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    }),
  };

  /* 判斷左右滑動 */
  const getDirection = () => {
    if (prevIndex === null) return 'none'; // 初次點擊
    if (prevIndex === 49 && currentIndex === 0) return 'right'; // 回到第一張
    if (prevIndex === 0 && currentIndex === 49) return 'left'; // 回到最後一張
    return currentIndex > prevIndex ? 'right' : 'left'; // 下一張或上一張
  };

  return (
    <div className="p-1">
      {/* 格狀畫廊 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {images.map((image, index) => (
          <div
            key={image}
            className={
              /* 判斷是否為雙倍高度 */
              doubleHeightIndices.includes(index)
                ? 'row-span-2 relative cursor-pointer'
                : 'relative cursor-pointer aspect-square'
            }
            onClick={() => handleImageClick(image, index)}
          >
            <Image
              src={image}
              alt={`${breedName} ${index}`}
              fill
              className="object-cover rounded-sm hover:brightness-50 transition duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>

      {/* 放大檢視模式 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          {/* 關閉按鈕 */}
          <button
            className="fixed top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
            onClick={handleClose}
          >
            <X className="cursor-pointer" />
          </button>
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 上一張按鈕 */}
            <button
              className="absolute left-1 top-1/2 -translate-y-1/2 -translate-x-12 bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition"
              onClick={handlePrevImage}
            >
              <ChevronLeft size={80} className="cursor-pointer" />
            </button>

            {/* 當前圖片 - 修改：添加 key 並移除無用的 animate-gallery-right */}
            <motion.div
              key={currentIndex} // 使用 currentIndex 作為 key，確保每次切換重新渲染
              custom={getDirection()} // 傳遞方向參數給 variants
              variants={imageVariants} // 使用定義的動畫變體
              initial="hidden" // 初始狀態
              animate="visible" // 目標狀態
              exit="exit" // 新增：退出動畫
            >
              {/* 當前圖片 */}
              <Image
                src={selectedImage}
                alt={`${breedName} selected`}
                width={1200}
                height={800}
                className="object-contain max-w-[90vw] max-h-[90vh] rounded-lg"
              />
            </motion.div>

            {/* 下一張按鈕 */}
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 translate-x-12 bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition"
              onClick={handleNextImage}
            >
              <ChevronRight size={80} className="cursor-pointer" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedGallery;
