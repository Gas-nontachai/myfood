import { test, expect } from '@playwright/test';

test('customer landing renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /dine-in ordering/i })).toBeVisible();
  await page.getByRole('link', { name: /start an order/i }).click();
  await expect(page.getByText(/today's menu/i)).toHaveCount(1);
});
