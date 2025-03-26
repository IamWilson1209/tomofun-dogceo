'use client';

import { X } from 'lucide-react';
import Link from 'next/link';

const SearchFormReset = () => {
  const reset = () => {
    const form = document.querySelector('.search_form') as HTMLFormElement;
    if (form) form.reset();
  };
  return (
    <button onClick={reset}>
      <Link href="/" className="text-white ">
        <X size={40} className="bg-black rounded-full p-2" />
      </Link>
    </button>
  );
};

export default SearchFormReset;
