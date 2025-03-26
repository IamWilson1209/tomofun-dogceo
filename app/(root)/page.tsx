import { getBreed } from '@/actions/actions';
import BreedCard from '@/comoponents/BreedCard';
import BackgroundCarousel from '@/comoponents/BackgroundCarousel';
import SearchForm from '@/comoponents/SearchForm';
import { PawPrint } from 'lucide-react';

/* 宣告Breed型別 */
interface Breed {
  name: string;
  image: string;
  subreed: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const query = (await searchParams).query;

  /* 用server action取得指定搜尋條件的breed list */
  const res = await getBreed(query);
  const breeds = res.data;

  return (
    <>
      <section className="global_background relative">
        <BackgroundCarousel />
        <div className="relative w-full z-30 flex flex-col items-center justify-center">
          <div className="flex flex-row">
            <h1 className="text-3xl text-white font-extrabold md:text-5xl">
              PawSearch
            </h1>
            <PawPrint size={20} />
          </div>
          <p className="text-lg sm:text-2xl md:text-3xl text-white font-semibold mt-3">
            Discover your favorite dog
          </p>
          <SearchForm query={query} />
        </div>
      </section>
      <ul className="mt-5 card_grid pb-8">
        {breeds.map((breed: Breed) => (
          <BreedCard
            breedName={breed.name}
            imageUrl={breed.image}
            key={breed.name}
          />
        ))}
      </ul>
    </>
  );
}

/* Home Skeleton 組件 */
function HomeSkeleton() {
  return (
    <>
      <section className="global_background relative">
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />{' '}
        <div className="relative w-full z-30 flex flex-col items-center justify-center">
          <div className="h-10 w-48 bg-gray-200 rounded-md animate-pulse md:h-14 md:w-64" />{' '}
          <div className="h-6 w-64 bg-gray-200 rounded-md mt-3 animate-pulse md:h-8 md:w-80" />{' '}
          <div className="max-w-3xl w-full h-20 bg-gray-200 rounded-md mt-8 animate-pulse" />{' '}
        </div>
      </section>
      <ul className="mt-5 card_grid pb-8">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <li
              key={index}
              className="h-64 w-full bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
      </ul>
      <section>
        <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />{' '}
      </section>
    </>
  );
}
