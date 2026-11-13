# UniMate Grade Tools

UniMate Grade Tools 是一個無額外依賴的 JavaScript 套件，可以計算已評分項目的加權平均，以及達到目標總成績所需的剩餘平均分數。

## 安裝

```bash
npm install unimate-grade-tools-juli
```

## 使用範例

```js
import { weightedAverage, requiredScore } from "unimate-grade-tools-juli";

const grades = [
  { score: 80, weight: 30 },
  { score: 90, weight: 20 },
];

console.log(weightedAverage(grades));    // 84
console.log(requiredScore(grades, 85)); // 86
```

已完成的項目共佔總成績的 50%，累計 42 分。若目標是 85 分，剩下的 50% 需要拿到 43 分，因此剩餘項目的加權平均至少要 86 分。

## 函式

| 函式 | 回傳值 |
| --- | --- |
| `weightedAverage(items)` | 按照輸入權重計算已評分項目的平均分數。至少需要一筆資料，權重合計可小於或大於 100。 |
| `requiredScore(items, target)` | 以 100 為課程總權重計算剩餘項目所需的平均分數。若已達標，回傳 `0`。若無法達標，回傳 `null`。 |

每筆資料的 `score` 必須介於 0 和 100 之間，`weight` 必須大於 0 且不超過 100。`requiredScore` 接受空陣列，已完成項目的權重合計必須低於 100。
