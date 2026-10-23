import {test,expect} from '@playwright/test';
test('使用者新增、完成、重新載入、取消完成並刪除任務',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'一步一步，完成目標。'})).toBeVisible();
 await page.getByRole('textbox',{name:'任務名稱'}).fill('完成 Week 7 測試');await page.getByRole('button',{name:'新增任務'}).click();
 const row=page.getByRole('listitem').filter({hasText:'完成 Week 7 測試'});await expect(row).toBeVisible();
 await row.getByRole('checkbox').check();await expect(page.locator('#summary')).toHaveText('已完成 1 / 1 項任務');
 await page.reload();await expect(row.getByRole('checkbox')).toBeChecked();
 await row.getByRole('checkbox').uncheck();await expect(page.locator('#summary')).toHaveText('已完成 0 / 1 項任務');
 await row.getByRole('button',{name:'刪除 完成 Week 7 測試'}).click();await expect(row).toHaveCount(0);await expect(page.locator('#empty')).toBeVisible();
});
test('空白任務顯示錯誤且不建立資料',async({page})=>{await page.goto('/');await page.getByRole('textbox',{name:'任務名稱'}).fill('   ');await page.getByRole('button',{name:'新增任務'}).click();await expect(page.getByRole('alert')).toHaveText('請輸入 1–100 字的任務名稱');await expect(page.getByRole('listitem')).toHaveCount(0);});
