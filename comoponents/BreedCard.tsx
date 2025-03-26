import Link from 'next/link';
import Image from 'next/image';

const BreedCard = ({
  breedName,
  imageUrl,
}: {
  breedName: string;
  imageUrl: string;
}) => {
  return (
    <li key={breedName}>
      <div className="flex flex-row items-center bg-white p-3 hover:bg-gray-100 transition-colors">
        <Link
          href={`/breed/${breedName}`}
          className="flex flex-row items-center w-full gap-4"
        >
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={imageUrl}
              alt={breedName}
              width={80}
              height={80}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          </div>
          <p className="font-sans text-md md:text-lg text-black/85">
            {breedName}
          </p>
        </Link>
      </div>
      <hr className="block sm:hidden px-10 text-gray-200" />
    </li>
  );
};

export default BreedCard;
