"use server"

import { breeds } from "@/data/breeds";
import { parseServerActionResponse } from "@/utils/parseServerActionResponse";
import { revalidateTag } from "next/cache";


/* 取得輪播清單的所有圖片 */
export const getAllBreedImages = async () => {
  try {
    /* 複製一份資料 */
    const breedData = breeds;

    /* 只提取圖片，並過濾掉其他值 */
    const imageArray = Object.values(breedData)
      .map((details) => details.image)
      .filter((image) => image);

    /* 回傳結果 */
    return parseServerActionResponse({
      data: imageArray,
      status: 'Success',
    });
  } catch (error) {
    console.log(`Error fetching all breed images`);
    return parseServerActionResponse({
      error: 'Error fetching all breed images',
      status: 'Error',
    });
  }
};


/* 根據Query取得Breed */
export const getBreed = async (query?: string) => {
  try {
    /* 複製一份資料 */
    const breedData = breeds;

    /* 將物件轉為陣列格式 */
    let breedArray = Object.entries(breedData).map(([name, details]) => ({
      /* 
        charAt(0): 取出第一個字符並轉為大寫
        slice(1): 取出其餘部分，保持原樣
      */
      name: name.charAt(0).toUpperCase() + name.slice(1), // 首字母大寫,
      image: details.image,
      subreed: details.subreed,
    }));

    /* 如果有query，條件篩選符合條件的 bread name */
    if (query) {
      breedArray = breedArray.filter((breed) =>
        breed.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    /* 回傳結果 */
    return parseServerActionResponse({
      data: breedArray,
      status: "Success",
    });
  } catch (error) {
    console.log(`Error fetching breed list`)
    return parseServerActionResponse({
      error: "Error fetching breed list",
      status: "Error"
    })
  }
}

/* 根據breedName取得此Breed中random的50張image */
export const getBreedImage = async (breedName: string, forceRefresh: boolean = false) => {
  try {
    /* 轉成小寫 */
    const lowerCaseBreedName = breedName.toLowerCase();

    /* 如果 forceRefresh 為 true，失效快取 */
    const cacheTag = `breed-images-${lowerCaseBreedName}`;
    if (forceRefresh) {
      revalidateTag(cacheTag);
    }

    /* 取得指定breed random 50 張images */
    const res = await fetch(`https://dog.ceo/api/breed/${lowerCaseBreedName}/images/random/50`, {
      cache: 'force-cache', // 強制使用快取，確保結果持久化
      next: {
        tags: [cacheTag], // 添加標籤，未來可以手動失效
      },
    })

    /* 解構資料 */
    const data = await res.json();
    const images = data.message;

    /* 回傳結果 */
    return images;
  } catch (error) {
    console.log(`Error fetching breed list`)
    return parseServerActionResponse({
      error: "Error fetching breed images",
      status: "Error"
    })
  }
}
