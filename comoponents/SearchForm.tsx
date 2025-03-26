'use client';

import Form from 'next/form';
import { FormEvent } from 'react';
import SearchFormReset from './SearchFormReset';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SearchForm = ({ query }: { query?: string }) => {
  const router = useRouter();

  /* 處裡搜尋表單提交事件 */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /* 取得搜尋表單輸入值 */
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('query').toString();

    /* 建構包含 searchQuery 的 url */
    const newUrl = searchQuery
      ? `/?query=${encodeURIComponent(searchQuery)}`
      : `/`;
    /* 使用 router.push() 跳轉到新頁面 */
    router.push(newUrl);
  };

  return (
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
        <button type="submit" className="search_btn">
          <Search size={40} className="bg-black rounded-full p-2" />
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
