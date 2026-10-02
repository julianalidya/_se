# HW4：Git Flow、GitHub Flow 實作紀錄

**學號：** 111210552  
**姓名：** 林小蓮  
**班級：** 資工四  

本次作業透過 GitHub 實際操作 Branch、Merge、Fork 與 Pull Request，
並使用兩組 Repository 練習不同的 GitHub 協作流程。

---

## 🔗 專案連結

### 練習一：Fork Repository 與 Branch

- **母專案（Original Repository）：**  
  https://github.com/se-test-examples/git-examples

- **子專案（Fork Repository）：**  
  https://github.com/julianalidya/git-examples

- **分支（developJuliBranch）：**  
  https://github.com/julianalidya/git-examples/tree/developJuliBranch

- **Pull Request #1：**  
  https://github.com/julianalidya/git-examples/pull/1

### 練習二：Mother Repository 與 Fork Pull Request

- **母專案：**  
  https://github.com/juli-se-example/git-example

- **子專案（Fork）：**  
  https://github.com/julianalidya/git-example

- **分支（developJuliBranch）：**  
  https://github.com/juli-se-example/git-example/tree/developJuliBranch

- **Fork Pull Request #2：**  
  https://github.com/juli-se-example/git-example/pull/2

---

# 練習一：GitHub Flow 基本操作

## 1. Fork

首先將母專案：

`se-test-examples/git-examples`

Fork 至自己的 GitHub 帳號。

Fork 完成後的 Repository：

`julianalidya/git-examples`

流程：

```text
se-test-examples/git-examples
            ↓ Fork
julianalidya/git-examples
```

---

## 2. 建立 Branch

在 Fork Repository 的 `main` 建立新的分支：

`developJuliBranch`

並在此分支進行修改。

概念上相當於：

```bash
git checkout main
git checkout -b developJuliBranch
```

---

## 3. Commit

在 `developJuliBranch` 中新增：

`juliBranch.md`

並提交修改：

```text
Create juliBranch.md
```

概念上相當於：

```bash
git add juliBranch.md
git commit -m "Create juliBranch.md"
git push origin developJuliBranch
```

---

## 4. Pull Request

完成 Branch 修改後，建立 Pull Request：

```text
developJuliBranch
        ↓
       main
```

透過 Pull Request 確認 Branch 中的修改內容。

---

## 5. Merge

確認修改內容後執行：

**Merge pull request**

將 `developJuliBranch` 的修改合併至 `main`。

流程如下：

```text
main
 ↓
developJuliBranch
 ↓
juliBranch.md
 ↓
Commit
 ↓
Pull Request
 ↓
Merge
 ↓
main
```

---

# 練習二：Fork 與跨 Repository Pull Request

為了進一步練習 Fork 與 Pull Request，本次另外建立母專案：

`juli-se-example/git-example`

並完成 Branch、Merge、Fork 以及從 Fork 回到母專案的 Pull Request。

---

## 6. Mother Repository Branch

在母專案：

`juli-se-example/git-example`

從 `main` 建立：

`developJuliBranch`

並在此 Branch 建立：

`juliBranch.md`

完成 Commit 後建立 Pull Request：

```text
developJuliBranch → main
```

確認內容後 Merge 至 `main`。

---

## 7. Fork Repository

接著將母專案 Fork 至個人帳號：

```text
juli-se-example/git-example
          ↓ Fork
julianalidya/git-example
```

Fork 完成後，在個人的 Repository 中建立：

`juliFork.md`

並 Commit 修改。

---

## 8. Fork Pull Request

完成 Fork 中的修改後，建立跨 Repository 的 Pull Request：

```text
julianalidya/git-example:main
              ↓
juli-se-example/git-example:main
```

Pull Request title：

```text
Create juliFork.md
```

確認沒有 conflict 後，執行 **Merge pull request**。

最後 `juliFork.md` 成功從個人的 Fork Repository 合併回母專案。

完整流程：

```text
Mother Repository
juli-se-example/git-example
          │
          ├── main
          │    ↓
          │ developJuliBranch
          │    ↓
          │ juliBranch.md
          │    ↓
          │ Pull Request
          │    ↓
          │  Merge
          │
          ↓
        Fork
          ↓
julianalidya/git-example
          ↓
     juliFork.md
          ↓
        Commit
          ↓
    Pull Request
          ↓
Mother Repository
          ↓
        Merge
```

---

# GitHub Flow 說明

本次主要使用 **GitHub Flow** 的方式進行操作。

GitHub Flow 以 `main` 為主要分支。進行修改時，可以建立新的 Branch，在 Branch 中完成修改與 Commit，再透過 Pull Request 檢查修改內容，最後 Merge 回 `main`。

Fork 則可以建立獨立的 Repository 副本。Fork Repository 完成修改後，也可以透過 Pull Request 將修改提交回原本的 Repository。

因此本次實際練習了兩種 Pull Request：

```text
同一 Repository：

Branch → Pull Request → main


不同 Repository：

Fork Repository → Pull Request → Mother Repository
```

透過這兩次操作，可以了解 Branch 與 Fork 在 GitHub 協作流程中的差異。

---

## 本次完成項目

| 項目 | 實作結果 |
|---|---|
| Fork Repository | ✅ 完成 |
| 建立 Branch | ✅ 完成 |
| Commit | ✅ 完成 |
| Branch Pull Request | ✅ 完成 |
| Branch Merge | ✅ 完成 |
| Fork 修改 | ✅ 完成 |
| Fork Pull Request | ✅ 完成 |
| Merge Fork 至母專案 | ✅ 完成 |
| GitHub Flow | ✅ 完成 |

---

## 結論

透過本次作業，我實際操作了 GitHub 的 Branch、Commit、Pull Request、Merge 與 Fork。

除了在同一個 Repository 中使用 Branch → Pull Request → Merge 的流程外，也另外練習了將 Repository Fork 至個人帳號，在 Fork 中修改內容，再透過 Pull Request 將修改合併回母專案。

透過實際操作，可以更清楚了解 Branch 與 Fork 的差異，以及 GitHub Flow 在不同 Repository 之間進行協作的方式。
