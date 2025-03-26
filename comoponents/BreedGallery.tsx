'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
const BreedGallery = ({
  images,
  breedName,
}: {
  images: string[];
  breedName: string;
}) => {
  /* 選取的圖片 */
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /* 輪播的索引 */
  const [currentIndex, setCurrentIndex] = useState(0);

  /* 修改：動態列數，預設 2 */
  const [columnCount, setColumnCount] = useState(2);

  /* 生成隨機高度 */
  const getRandomHeight = () => {
    const minHeight = 200;
    const maxHeight = 500;
    return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  };

  /* useMemo 確保高度只在初次渲染時生成 */
  const imageHeights = useMemo(() => {
    return images.map(() => getRandomHeight()); // 返回想記憶的高度
  }, [images]); // 依賴項不變，imageHeights會返回原本的結果

  /* 修改：動態檢測螢幕寬度，同步 CSS 的 column-count */
  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth >= 1024) {
        setColumnCount(4);
      } else if (window.innerWidth >= 768) {
        setColumnCount(3);
      } else {
        setColumnCount(2);
      }
    };

    updateColumnCount(); // 初次設置
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // 修改：根據動態 columnCount 計算二維陣列
  const grid = useMemo(() => {
    const cols = [];
    for (let i = 0; i < columnCount; i++) {
      cols[i] = [];
    }
    images.forEach((image, index) => {
      const col = index % columnCount;
      cols[col].push(index);
    });
    return cols;
  }, [images, columnCount]);

  // 修改：根據 index 查找當前位置
  const getPosition = (index: number) => {
    for (let col = 0; col < grid.length; col++) {
      const row = grid[col].indexOf(index);
      if (row !== -1) return { col, row };
    }
    return { col: 0, row: 0 };
  };

  /* 點擊圖片放大，同時更新index位置 */
  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  /* 關閉放大的圖片 */
  const handleClose = () => {
    setSelectedImage(null);
  };

  /* 放大檢視時切換至上一張 */
  // 修改：下一張圖片根據二維陣列移動
  const handleNextImage = () => {
    const { col, row } = getPosition(currentIndex);
    let nextCol = col + 1;
    let nextRow = row;

    // 如果超出當前行，跳到下一行的第一列
    if (nextCol >= columnCount || !grid[nextCol][nextRow]) {
      nextCol = 0;
      nextRow = row + 1;
    }

    // 如果超出總行數，回到第一張
    if (nextRow >= grid[0].length) {
      nextCol = 0;
      nextRow = 0;
    }

    const nextIndex = grid[nextCol][nextRow];
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  // 修改：上一張圖片根據二維陣列移動
  const handlePrevImage = () => {
    const { col, row } = getPosition(currentIndex);
    let prevCol = col - 1;
    let prevRow = row;

    // 如果小於當前行，跳到上一行的最後一列
    if (prevCol < 0) {
      prevCol = columnCount - 1;
      prevRow = row - 1;
    }

    // 如果超出總行數，回到最後一張
    if (prevRow < 0) {
      prevCol = columnCount - 1;
      prevRow = grid[prevCol].length - 1;
    }

    const prevIndex = grid[prevCol][prevRow];
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  return (
    <div className="p-4">
      {/* 類似Pinterest的瀑布流畫廊 */}
      <div className="gallery-container">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => handleImageClick(image, index)}
            className="gallery-item cursor-pointer mb-4 break-inside-avoid relative group" // 記得用group，才能用hover功能
          >
            <Image
              src={image}
              alt={`${breedName}`}
              width={0} // 設 0，讓寬度自適應容器
              height={0} // 設 0，讓高度根據圖片比例自動調整
              sizes="100vw" // 根據設備寬度選擇適當圖片尺寸，100vw 表示圖片可能佔據整個視窗寬度
              style={{
                width: '100%', // 寬度讓圖片填滿容器
                height: 'auto', // 高度根據原始比例，e.g. index 0 如果超過 300px（例如 400px），會顯示為 400px
                minHeight: `${imageHeights[index]}px`, // Advance，使用隨機高度
                /* 
                minHeight:
                  index % 3 === 0 // 0, 3, 6: 設定最小高度300px
                  ? '300px'
                  : index % 2 === 0 // 如果條件一不成立，2, 4, ...: 設定最小高度200px
                  ? '200px'
                  : '250px', // 1、5、7...設定最小高度250px 
                */
              }}
              className="rounded-lg object-cover group-hover:brightness-50 transition duration-300" // 讓圖片填滿容器並裁剪多餘部分
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg opacity-0 hover:opacity-100 transition duration-300">
              {index}
            </div>
          </div>
        ))}
      </div>

      {/* 點擊放大顯示 */}
      {/* 修改：放大模式現在包含導航按鈕 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 上一張按鈕 */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* 當前圖片 */}
            <Image
              src={selectedImage}
              alt={`${breedName} selected`}
              width={1200}
              height={800}
              className="object-contain max-w-[90vw] max-h-[90vh]"
            />

            {/* 下一張按鈕 */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* 關閉按鈕保持不變 */}
            <button
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedGallery;
