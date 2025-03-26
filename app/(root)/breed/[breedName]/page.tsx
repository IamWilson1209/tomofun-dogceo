import { getBreedImage } from '@/actions/actions';
import BreedGallery from '@/comoponents/BreedGallery';
import Link from 'next/link';
import { Dog, PawPrint } from 'lucide-react';
import RefreshButton from '@/comoponents/RefreshButton';

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
      {/* Navbar 區域 */}
      <nav className="fixed top-0 left-0 w-full bg-amber-400/70 shadow-lg z-10 transition-all duration-300">
        <div className="flex flex-row justify-between items-center px-4 py-3 md:py-4 max-w-7xl mx-auto w-full">
          {/* 左側按鈕 */}
          <div className="flex items-center">
            <button className="group relative">
              <Link href="/" className="flex flex-row items-center">
                <p className="text-black text-lg md:text-xl font-semibold tracking-wide hover:text-gray-700 transition-colors duration-200 group-hover:scale-105 mr-2">
                  <PawPrint className="size-[32px] lg:size-[35px]" />
                </p>
                <p className="font-sans text-black font-bold text-[15px] md:text-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Back to Home
                </p>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-700 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </button>
          </div>

          {/* 中間標題 - 使用 margin auto 居中 */}
          <div className="flex flex-row items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            {/* <Dog className="text-black" size={30} /> */}
            <h1 className="font-extrabold font-sans text-black text-xl md:text-2xl">
              {breedName}
            </h1>
          </div>

          {/* 右側刷新按鈕 */}
          <div className="flex items-center justify-end">
            <RefreshButton breedName={breedName} />
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
