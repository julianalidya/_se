# HW4：分支、合併、Fork、Pull Request 實作紀錄

**學號：** 111210552  
**姓名：** 林小蓮  
**班級：** 資工四  

本次作業使用 GitHub 實際操作 GitHub Flow，包含 Fork、建立分支、Commit、Pull Request 與 Merge。

---

## 🔗 專案連結

- **母專案（Original Repository）：**  
  https://github.com/se-test-examples/git-examples

- **子專案（Fork Repository）：**  
  https://github.com/julianalidya/git-examples

- **分支（developJuliBranch）：**  
  https://github.com/julianalidya/git-examples/tree/developJuliBranch

- **Pull Request #1：**  
  https://github.com/julianalidya/git-examples/pull/1

---

## 1. Fork（建立子專案）

首先將老師提供的母專案：

`se-test-examples/git-examples`

使用 GitHub 的 **Fork** 功能複製到自己的 GitHub 帳號。

Fork 完成後，我的子專案為：

`julianalidya/git-examples`

### GitHub 上的操作

1. 進入母專案 `se-test-examples/git-examples`
2. 點選右上角的 **Fork**
3. Owner 選擇 `julianalidya`
4. Repository name 保留 `git-examples`
5. 點選 **Create fork**

完成後：

```text
母專案：
se-test-examples/git-examples

        ↓ Fork

子專案：
julianalidya/git-examples
```

---

## 2. 分支（Branch）

在自己的 Fork Repository 中，從 `main` 建立新的開發分支：

`developJuliBranch`

### GitHub 上的操作

1. 進入 `julianalidya/git-examples`
2. 開啟 **Branches**
3. 點選 **New branch**
4. New branch name 輸入 `developJuliBranch`
5. Source repository 選擇 `julianalidya/git-examples`
6. Source branch 選擇 `main`
7. 點選 **Create new branch**

相當於使用 Git 指令：

```bash
git checkout main
git checkout -b developJuliBranch
```

建立後共有兩個分支：

```text
main
└── developJuliBranch
```

---

## 3. 新增檔案與 Commit

切換至 `developJuliBranch` 後，我在此分支新增：

`juliBranch.md`

檔案內容：

```markdown
# Git Branch Practice

Name: 林小蓮
Student ID: 111210552
Department: 資工四

This file was created in the `developJuliBranch` branch to practice the GitHub Flow workflow.
```

Commit message：

```text
Create juliBranch.md
```

若使用 Git 指令，流程相當於：

```bash
git checkout developJuliBranch
git add juliBranch.md
git commit -m "Create juliBranch.md"
git push origin developJuliBranch
```

此時修改只存在於 `developJuliBranch`，尚未合併到 `main`。

---

## 4. Pull Request

完成分支修改後，建立 Pull Request，將 `developJuliBranch` 的內容準備合併到 `main`。

### Pull Request 設定

```text
base: main
←
compare: developJuliBranch
```

Pull Request title：

```text
Create juliBranch.md
```

Description：

```text
Practice pull request and merge using GitHub Flow.
```

Pull Request：

https://github.com/julianalidya/git-examples/pull/1

若使用 GitHub CLI，也可以使用：

```bash
gh pr create \
  --base main \
  --head developJuliBranch \
  --title "Create juliBranch.md"
```

---

## 5. 合併（Merge）

確認 Pull Request 沒有 conflict 後，將 `developJuliBranch` 合併至 `main`。

### GitHub 上的操作

1. 開啟 Pull Request #1
2. 確認 Files changed
3. 點選 **Merge pull request**
4. 點選 **Confirm merge**
5. Pull Request 顯示 **Merged**

最後的流程：

```text
main
  │
  ├── create developJuliBranch
  │
  └── developJuliBranch
          │
          ├── Create juliBranch.md
          │
          ├── Commit
          │
          └── Pull Request
                    │
                    ▼
              Merge into main
                    │
                    ▼
                  main
```

若使用 Git 指令直接進行 merge，概念上相當於：

```bash
git checkout main
git merge developJuliBranch
git push origin main
```

本次實作則使用 GitHub 的 **Pull Request → Merge pull request** 完成合併。

---

## 6. GitHub Flow 流程說明

本次作業主要採用 **GitHub Flow**。

GitHub Flow 是以 `main` 為主要分支的簡單協作流程。開發新功能或修改內容時，不直接修改 `main`，而是先建立新的 branch，在 branch 中完成修改並 commit，接著建立 Pull Request。確認修改內容後，再將 Pull Request merge 回 `main`。

本次實作流程為：

```text
Fork Repository
      ↓
main
      ↓
Create Branch
      ↓
developJuliBranch
      ↓
Create juliBranch.md
      ↓
Commit
      ↓
Pull Request
      ↓
Merge
      ↓
main
```

與較複雜、包含 `develop`、`release`、`hotfix` 等長期分支的 **Git Flow** 相比，GitHub Flow 的流程較簡單，適合持續開發以及透過 Pull Request 進行協作的專案。

---

## 7. 本次操作結果

| 項目 | 實作結果 |
|---|---|
| Fork | ✅ 完成 |
| Branch | ✅ `developJuliBranch` |
| Commit | ✅ `Create juliBranch.md` |
| Pull Request | ✅ Pull Request #1 |
| Merge | ✅ `developJuliBranch → main` |
| Workflow | ✅ GitHub Flow |

---

## 結論

透過本次作業，我實際操作了 GitHub 的 Fork、Branch、Commit、Pull Request 與 Merge。

先從母專案建立自己的 Fork，再從 `main` 建立 `developJuliBranch`。修改完成後透過 Pull Request 將內容合併回 `main`，完成一次完整的 GitHub Flow 開發流程。
