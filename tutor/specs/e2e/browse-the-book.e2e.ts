import { visitPage, Mocker, setTimeouts } from './helpers'

describe('Browse the book', () => {

    beforeEach(async () => {
        await setTimeouts()
    })

    Mocker.mock({
        page,
        routes: {},
    })

    it('loads the book screen', async () => {
        await visitPage(page, '/book/1')
        await expect(page).toHaveSelector('testEl=reference-book')
        await page.click('testEl=my-highlights-btn')
        await expect(page).toHaveSelector('testEl=highlights-notes-modal')
    })

    it('can use arrows to move forward or backward', async () => {
        await visitPage(page, '/book/1')
        await page.waitForSelector('testEl=book-title')
        const currentTitle = await page.$eval('[data-test-id="book-title"]' , ex => ex.dataset.title) as string
        await page.click('testEl=go-forward')
        await expect(page).not.toHaveText('testEl=book-title', currentTitle)
        await page.click('testEl=go-backward')
        await expect(page).toHaveText('testEl=book-title', currentTitle)
    })
})
