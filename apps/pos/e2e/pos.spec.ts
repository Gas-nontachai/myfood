import { test, expect } from '@playwright/test';

test('POS dashboard loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/Tonight's orders/i)).toBeVisible();
  await page.getByRole('button', { name: /new table/i }).click();
});
