import { visitPage, withUser, expect, test } from './test'

withUser('teacher01')

test.beforeEach(async ({ page }) => {
    await visitPage(page, '/course/1/roster')
})

test('shows instructor join', async ({ page }) => {
    await page.click('text=Add Instructor')
    await expect(page).toMatchText('.modal-body', /Share this link with an instructor/)
})
