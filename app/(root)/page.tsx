import { getBreed } from '@/actions/actions';
import BreedCard from '@/comoponents/BreedCard';
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

  /*用server action取得指定搜尋條件的breed list*/
  const res = await getBreed(query);
  const breeds = res.data;

  return (
    <>
      <section className="global_background">
        <h1 className="text-4xl text-black font-extrabold">狗狗蒐尋器</h1>
        <p className="text-3xl text-black font-semibold mt-3">搜尋狗狗</p>
        <SearchForm query={query} />
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
