import { getBreed } from '@/actions/actions';
import BreedCard from '@/comoponents/BreedCard';
import BackgroundCarousel from '@/comoponents/BackgroundCarousel';
import SearchForm from '@/comoponents/SearchForm';

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
  const images = breeds.map((breed: Breed) => breed.image);

  return (
    <>
      <section className="global_background relative">
        <BackgroundCarousel images={images} />
        <div className="relative w-full z-30 flex flex-col items-center justify-center">
          <h1 className="text-5xl text-white font-extrabold sm:text-2xl">
            Dog Searcher
          </h1>
          <p className="text-3xl text-white font-semibold mt-3 sm:text-lg">
            Search for your favorite dog
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
      <section>
        <p>{query ? `搜尋結果 ${query}` : ``}</p>
      </section>
    </>
  );
}
