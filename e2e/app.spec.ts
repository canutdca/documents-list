import { test, expect } from '@playwright/test'

test.describe('Documents List App', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Documents' })).toBeVisible()

    await expect(page.locator('documents-container')).toBeVisible()

    await expect(page.locator('documents-list')).toBeVisible()

    await expect(
      page.getByRole('toolbar', { name: 'Document view controls' })
    ).toBeVisible()
  })
})
