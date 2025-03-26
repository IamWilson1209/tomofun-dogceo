import fetch from 'node-fetch';
import * as fs from 'fs';
import path from 'path';

/* 宣告資料儲存路徑，確保 data 資料夾存在 */
const dataDir = '../data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

async function fetchBreedsWithImages() {
  try {
    /* 取得所有品種列表 */
    const res = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await res.json();
    const breeds = data.message;

    /* 宣告最終結果物件 */
    const result = {};

    /* 對每個品種進行處理 */
    for (const breed in breeds) {
      /* 隨機取得該品種的隨機圖片 */
      const imageRes = await fetch(
        'https://dog.ceo/api/breed/' + breed + '/images/random'
      );
      const imageData = await imageRes.json();

      /* 輸入資料 */
      result[breed] = {
        image: imageData.message,
        subreed: breeds[breed], // subreed陣列，可能為空
      };

      /* 印出執行狀態 */
      console.log(`Processed ${breed}`);
    }

    /* 不一定要：將結果寫入json檔案 */
    const outputPath = path.join(dataDir, 'breeds.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

    /* 印出執行狀態 */
    console.log('Breeds with images saved to breeds.json');

    /* 輸出 TypeScript 格式 */
    const tsOutputPath = path.join(dataDir, 'breeds.ts');
    fs.writeFileSync(
      tsOutputPath,
      'export const breeds = ' + JSON.stringify(result, null, 2) + ' as const;'
    );

    /* 印出執行狀態 */
    console.log('TypeScript version saved to breeds.ts');
  } catch (error) {
    console.error('Error fetching breeds:', error);
  }
}

fetchBreedsWithImages();
