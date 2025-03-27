'use client';

import { useTransition } from 'react';
import { RefreshCw } from 'lucide-react';
import { getBreedImage } from '@/actions/actions';

export default function RefreshButton({ breedName }: { breedName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRefresh = async () => {
    startTransition(async () => {
      await getBreedImage(breedName, true); // 強制刷新
      window.location.reload(); // 重新整理頁面以更新圖片
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
    >
      <RefreshCw className={isPending ? 'animate-spin' : ''} size={20} />
      <span className="hidden sm:block">
        {isPending ? 'Refreshing...' : 'Refresh'}
      </span>
    </button>
  );
}
