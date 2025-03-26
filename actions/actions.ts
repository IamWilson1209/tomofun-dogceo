"use server"

import { breeds } from "@/data/breeds";
import { parseServerActionResponse } from "@/utils/parseServerActionResponse";

/* 取得指定條件的Breed */
export const getBreed = async (query?: string) => {
  try {
    /* 取得所有breed name */
    const breedData = breeds;

    /* 將物件轉為陣列格式 */
    let breedArray = Object.entries(breedData).map(([name, details]) => ({
      name,
      image: details.image,
      subreed: details.subreed,
    }));

    /* 如果有query，條件篩選符合條件的 bread name */
    // 如果有 query，篩選陣列
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
    const res = await fetch(`https://dog.ceo/api/breed/${breedName}/images/random/50`)
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
