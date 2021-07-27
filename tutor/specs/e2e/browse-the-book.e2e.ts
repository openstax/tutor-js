import { visitPage, test, expect } from './test'

test.describe('Browse the book', () => {

    test.skip()

    test('loads the book screen', async ({ page }) => {
        await visitPage(page, '/book/1')
        await expect(page).toHaveSelector('testId=reference-book')
        await page.click('testId=my-highlights-btn')
        await expect(page).toHaveSelector('testId=highlights-notes-modal')
    })

    test('can use arrows to move forward or backward', async ({ page }) => {
        await visitPage(page, '/book/1')
        await page.waitForSelector('testId=book-title')
        const currentTitle = await page.$eval('[data-test-id="book-title"]' , ex => ex.dataset.title) as string
        await page.click('testId=go-forward')
        await expect(page).not.toHaveText('testId=book-title', currentTitle)
        await page.click('testId=go-backward')
        await expect(page).toHaveText('testId=book-title', currentTitle)
    })
})
