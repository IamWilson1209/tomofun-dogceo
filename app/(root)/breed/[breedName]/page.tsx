import { getBreedImage } from '@/actions/actions';
import BreedGallery from '@/comoponents/BreedGallery';
import Link from 'next/link';
import { ArrowLeftFromLine } from 'lucide-react';

const BreedPage = async ({
  params,
}: {
  params: Promise<{ breedName: string }>;
}) => {
  const breedName = (await params).breedName;
  /* 獲取所有狗狗圖片 */
  const images = await getBreedImage(breedName);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Navbar 區域 - 修正後的版本 */}
      <nav className="fixed top-0 left-0 w-full bg-amber-400 shadow-lg z-10 transition-all duration-300">
        <div className="flex flex-row justify-between items-center px-4 py-3 md:py-4 max-w-7xl mx-auto">
          {/* 左側按鈕 - 調整為 flex-1 並左對齊 */}
          <div className="flex-1 flex justify-start">
            <button className="group relative">
              <Link href="/">
                <p className="text-black text-lg md:text-xl font-semibold tracking-wide hover:text-gray-700 transition-colors duration-200 group-hover:scale-105">
                  <ArrowLeftFromLine className="size-[30px] lg:size-[35px]" />
                </p>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-700 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </button>
          </div>

          {/* 中間標題 - 移除 flex-1 ，添加 text-center 在小螢幕，隱藏在中等以上螢幕 */}
          <div className="flex-1 md:flex-none px-2 text-center md:hidden">
            <h1 className="font-extrabold font-sans text-black text-xl md:text-2xl bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text animate-pulse">
              Breed: {breedName}
            </h1>
          </div>

          {/* 右側標題 - 只在中等以上螢幕顯示 */}
          <div className="flex-1 hidden md:flex justify-end">
            <h1 className="font-extrabold font-sans text-black text-xl md:text-2xl bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text animate-pulse">
              Breed: {breedName}
            </h1>
          </div>
        </div>
      </nav>

      {/* 內容區域 */}
      <div className="mt-16 flex-1 w-full">
        <BreedGallery images={images} breedName={breedName} />
      </div>
    </div>
  );
};
export default BreedPage;

function BreedGallerySkeleton() {
  return (
    <div className="p-1 mt-16 flex-1 w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={
                [1, 4].includes(index)
                  ? 'row-span-2 bg-gray-200 rounded-sm animate-pulse'
                  : 'aspect-square bg-gray-200 rounded-sm animate-pulse'
              }
            />
          ))}
      </div>
    </div>
  );
}
