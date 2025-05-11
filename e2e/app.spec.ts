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

  test('should change view when clicking view selector', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('documents-list')).toBeVisible()
    await expect(page.locator('documents-cards')).not.toBeVisible()

    await page.locator('view-selector label:nth-of-type(2)').click()
    await expect(page.locator('documents-list')).toBeHidden()
    await expect(page.locator('documents-cards')).toBeVisible()

    await page.locator('view-selector label:nth-of-type(1)').click()
    await expect(page.locator('documents-cards')).toBeHidden()
    await expect(page.locator('documents-list')).toBeVisible()
  })

  test('should create a new document from cards view', async ({ page }) => {
    await page.goto('/')

    await page.locator('view-selector label:nth-of-type(2)').click()
    await expect(page.locator('documents-cards')).toBeVisible()

    const initialCards = await page
      .locator('documents-cards article:not([aria-label="Add Document"])')
      .count()

    await page.getByRole('article', { name: 'Add Document' }).click()

    await page.getByLabel('Name').fill('Test Document from Cards')
    await page.getByLabel('Version').fill('1.0.0')
    await page.getByLabel('Contributors').fill('Test User')
    await page.getByLabel('Attachments').fill('test.pdf')

    await page.getByRole('button', { name: 'Create' }).click()

    await expect(
      page.locator('documents-cards article:not([aria-label="Add Document"])')
    ).toHaveCount(initialCards + 1)
    await expect(page.getByText('Test Document from Cards')).toBeVisible()
  })

  test('should create a new document from list view', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('documents-list')).toBeVisible()

    const initialRows = await page
      .locator('documents-list article[role="row"]:not([onclick])')
      .count()

    await page.getByRole('row', { name: '+ Add Document' }).click()

    await page.getByLabel('Name').fill('Test Document from List')
    await page.getByLabel('Version').fill('1.0.0')
    await page.getByLabel('Contributors').fill('Test User')
    await page.getByLabel('Attachments').fill('test.pdf')

    await page.getByRole('button', { name: 'Create' }).click()

    await expect(
      page.locator('documents-list article[role="row"]:not([onclick])')
    ).toHaveCount(initialRows + 1)
    await expect(page.getByText('Test Document from List')).toBeVisible()
  })
})
