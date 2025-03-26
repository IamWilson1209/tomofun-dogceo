import { getBreedImage } from '@/actions/actions';
import BreedGallery from '@/comoponents/BreedGallery';
import Link from 'next/link';

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
      <nav className="fixed top-0 left-0 w-full bg-amber-400 shadow-md z-10">
        <div className="flex flex-row justify-between items-center px-4 py-2 max-w-7xl mx-auto">
          <button>
            <Link href="/">
              <p className="text-black text-xl hover:text-gray-700">返回首頁</p>
            </Link>
          </button>
          <h1 className="font-extrabold font-serif text-black">
            Breed: {breedName}
          </h1>
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
