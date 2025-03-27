'use client';

import Form from 'next/form';
import { FormEvent, useState } from 'react';
import SearchFormReset from './SearchFormReset';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchSchema } from '@/schema/search-form-schema';

const SearchForm = ({ query }: { query?: string }) => {
  const router = useRouter();
  const [input, setInput] = useState(query || '');
  const [error, setError] = useState<string | null>(null);

  /* 處裡搜尋表單提交事件 */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /* 取得搜尋表單輸入值 */
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('query').toString();

    /* 使用zod驗證輸入 */
    const result = searchSchema.safeParse(searchQuery);

    /* 如果驗證失敗，顯示錯誤訊息 */
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    /* 驗證成功，清空錯誤 */
    setError(null);

    /* 建構包含 searchQuery 的 url */
    const newUrl = searchQuery
      ? `/?query=${encodeURIComponent(searchQuery)}`
      : `/`;
    /* 使用 router.push() 跳轉到新頁面 */
    router.push(newUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-left">
      <Form
        action="/"
        scroll={false}
        className="search_form"
        onSubmit={handleSubmit}
      >
        <input
          name="query"
          defaultValue={query}
          className="search_input"
          placeholder="Search for a specific breed..."
        />
        <div className="flex flex-row gap-1">
          {/* 如果有輸入值，顯示清除按鈕 */}
          {query && <SearchFormReset />}
          {/* 如果不符合規範，顯示錯誤 */}
          <button type="submit" className="search_btn">
            <Search size={40} className="bg-black rounded-full p-2" />
          </button>
        </div>
      </Form>
      {error && (
        <p className="flex items-start text-red-500 text-sm font-sans font-bold mt-2 w-full">
          {error}, please try again
        </p>
      )}
    </div>
  );
};

export default SearchForm;
