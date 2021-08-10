import { visitPage, withUser, expect, test } from './test'

withUser('teacher01')

test('shows instructor join', async ({ page }) => {
    await visitPage(page, '/course/1/roster')
    await page.click('text=Add Instructor')
    await expect(page).toMatchText('.modal-body', /Share this link with an instructor/)
})
