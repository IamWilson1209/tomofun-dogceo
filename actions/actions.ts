"use server"

import { breeds } from "@/data/breeds";
import { parseServerActionResponse } from "@/utils/parseServerActionResponse";


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
      name,
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
export const getBreedImage = async (breedName: string) => {
  try {
    /* 取得指定breed random 50 張images */
    const res = await fetch(`https://dog.ceo/api/breed/${breedName}/images/random/50`, {
      cache: 'force-cache', // 強制使用快取，確保結果持久化
      next: {
        tags: [`breed-images-${breedName}`], // 添加標籤，以便未來手動失效
      },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch breed images');
    }

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
