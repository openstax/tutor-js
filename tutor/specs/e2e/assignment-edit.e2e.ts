import { visitPage, setRole, disableTours, setTimeouts } from './helpers'
import { fake } from '../factories/helpers'
// @ts-ignore
import moment from 'moment-timezone'

describe('Assignment Edit', () => {
    const format = 'MMM D | hh:mm A'
    let typedOpenDate = moment().add(1, 'weeks').format('MMM D [| 05:00 PM]')
    let typedDueDate = moment().add(2, 'weeks').format('MMM D [| 05:00 PM]')
    let typedClosesDate = moment().add(3, 'weeks').format('MMM D [| 05:00 PM]')

    const fillDetails = async () => {
        expect(await page.innerText('.heading')).toContain('STEP 1')
        expect(await (page as any).isDisabled('.controls .btn-primary')).toBe(true)
        await page.type('input[name="title"]', 'test assignment #1')
        expect(await (page as any).isDisabled('.controls .btn-primary')).toBe(false)
    }

    const addTemplate = async ({ name = '', dueDateOffsetDays = '1', dueTimeHour = '17',
        dueTimeMinutes = '30', closesDateOffsetDays = '30', isAM = false, doSelect = false }) => {
        await page.click('testEl=grading-templates')
        await page.click('testEl=add-template')
        expect(await (page as any).isVisible('.modal')).toBe(true)
        await page.type('.modal input[name="name"]', name)
        await page.selectOption('.modal select[name="default_due_date_offset_days"]', dueDateOffsetDays)
        await page.selectOption('.modal select[name="default_due_time_hour"]', dueTimeHour)
        await page.selectOption('.modal select[name="default_due_time_minute"]', dueTimeMinutes)
        await page.selectOption('.modal select[name="default_close_date_offset_days"]', closesDateOffsetDays)
        await page.waitForTimeout(100)
        await page.check(`.modal input[value="${isAM ? 'am' : 'pm'}"]`, { force: true })
        await page.click('.modal [type="submit"]')

        if(doSelect) {
            await page.click('testEl=grading-templates')
            await page.click(`testEl=${name}`)
        }
    }

    beforeEach(async () => {
        await setTimeouts()
        await setRole('teacher')
    })

    it('validates', async () => {
        await visitPage(page, '/course/2/assignment/edit/homework/new')
        await disableTours()
        await page.type('input[name="title"]', ' ')
        await page.keyboard.press('Tab')
        await expect(page).toHaveSelector('[aria-invalid][data-target="title"]')

        await page.fill('textarea[name="description"]', fake.lorem.paragraphs(5))
        await page.keyboard.press('Tab')
        expect(await page.innerText('[aria-invalid][data-target="description"]')).toContain('Cannot be longer')
    })

    it('loads and advances homework', async () => {
        await visitPage(page, '/course/2/assignment/edit/homework/new')
        await disableTours()
        await fillDetails()
        await page.click('.controls .btn-primary')
        expect(await page.innerText('.heading')).toContain('STEP 2')
        expect(await (page as any).isDisabled('.controls .btn-primary')).toBe(true)
        await page.click('.chapter[data-is-expanded="false"]')
        await page.click('[data-chapter-section="2.1"]')
        await page.click('[data-chapter-section="2.2"]')
        expect(await (page as any).isDisabled('.controls .btn-primary')).toBe(false)

        await page.click('.controls .btn-primary')
        expect(await page.innerText('.heading')).toContain('STEP 3')
        expect(await (page as any).isDisabled('.controls .btn-primary')).toBe(true)

        // This needs a small timeout for the hover state
        await page.hover(':nth-match(.action.include, 1)', { force: true })
        await page.waitForTimeout(100)
        await page.click(':nth-match(.action.include, 1)')
        await page.waitForTimeout(100)

        await page.hover(':nth-match(.action.include, 2)', { force: true })
        await page.waitForTimeout(100)
        await page.click(':nth-match(.action.include, 2)')
        await page.waitForTimeout(100)

        await page.hover(':nth-match(.action.include, 3)', { force: true })
        await page.waitForTimeout(100)
        await page.click(':nth-match(.action.include, 3)')
        await page.waitForTimeout(100)

        expect(await (page as any).isDisabled('.controls .btn-primary')).toBe(false)
        await page.click('.controls .btn-primary')
        await page.waitForTimeout(100)
        expect(await page.innerText('.heading')).toContain('STEP 4')
        expect(await page.evaluate(() =>
            (document.querySelectorAll('.openstax-exercise-preview') as any).length
        )).toBe(3)

        await page.click(':nth-match(button.ox-icon-arrow-up, 2)')
    })

    it('loads and advances reading', async () => {
        await visitPage(page, '/course/1/assignment/edit/reading/new')
        await disableTours()
        await fillDetails()
        await page.click('.controls .btn-primary')

        expect(await page.innerText('.heading')).toContain('STEP 2')
        expect(await (page as any).isDisabled('.controls .btn-primary')).toBe(true)
        await page.click('.chapter[data-is-expanded="false"]')
        await page.click('[data-chapter-section="2.1"]')
        await page.click('[data-chapter-section="2.2"]')
        await page.click('[data-chapter-section="2.3"]')
        expect(await (page as any).isDisabled('.controls .btn-primary')).toBe(false)
        await page.click('.controls .btn-primary')

        expect(await page.innerText('.heading')).toContain('STEP 3')
        expect(await page.$$eval('.chapter-section', (nodes: any) =>
            nodes.map((n: any) => (n as any).innerText)
        )).toEqual(['2.1', '2.2', '2.3'])

        await page.click(':nth-match(button.ox-icon-arrow-up, 2)')
        expect(await page.$$eval('.chapter-section', (nodes: any) =>
            nodes.map((n: any) => (n as any).innerText)
        )).toEqual(['2.1', '2.3', '2.2'])
    })

    it('increases selections', async () => {
        await visitPage(page, '/course/2/assignment/edit/homework/new')
        await disableTours()
        await fillDetails()

        await page.click('.controls .btn-primary')
        await page.click('.chapter-checkbox .btn')
        await page.click('.controls .btn-primary')
        expect(await page.innerText('testEl=selection-count-mcq')).toContain('0')
        expect(await page.innerText('testEl=selection-count-wrq')).toContain('0')
        expect(await page.innerText('testEl=selection-count-footer')).toContain('0')

        await page.click('testEl=question-type-menu')
        await page.click('testEl=wrq-filter', { force: true })
        await page.click('testEl=question-type-menu')
        await page.hover(':nth-match(.action.include, 1)', { force: true })
        await page.waitForTimeout(100)
        await page.click(':nth-match(.action.include, 1)', { force: true })
        await page.waitForTimeout(10)

        expect(await page.innerText('testEl=selection-count-mcq')).toContain('1')
        expect(await page.innerText('testEl=selection-count-footer')).toContain('1')
        expect(await page.innerText('testEl=tutor-count')).toContain('3')
        expect(await page.innerText('testEl=tutor-count-footer')).toContain('3')
        expect(await page.innerText('testEl=total-count')).toContain('4')
        expect(await page.innerText('testEl=total-count-footer')).toContain('4')
    })

    it('filters question types', async () => {
        await visitPage(page, '/course/2/assignment/edit/homework/new')
        await disableTours()
        await fillDetails()

        await page.click('.controls .btn-primary')
        await page.click('.chapter-checkbox .btn')
        await page.click('.controls .btn-primary')
        await page.click('testEl=question-type-menu')
        await page.click('testEl=wrq-filter', { force: true })
        expect(await page.innerText('[data-section]')).not.toContain('Written Response Questions')
    })

    it('renders external assignment', async () => {
        await visitPage(page, '/course/2/assignment/edit/external/new')
        await disableTours()
        expect(await page.innerText('.heading')).not.toContain('STEP 1')
        await page.type('[name="settings.external_url"]', 'url')
    })

    it('can add a new template', async () => {
        const templateName = 'This is a new template'
        await visitPage(page, '/course/2/assignment/edit/homework/new')
        await disableTours()
        await fillDetails()
        await addTemplate({ name: templateName })
        expect(await page.innerText(`testEl=${templateName}`)).toContain(templateName)
    })

    it('can select another template and update dates, and change pivot dates to update other dates', async () => {
        const templateName = 'Template to update dates'
        const dueDateOffsetDays = '3', dueTimeHour = '19', dueTimeMinutes = '15', closesDateOffsetDays = '10', isAM = false

        await visitPage(page, '/course/2/assignment/edit/homework/new')
        await disableTours()
        await fillDetails()
        await addTemplate({ name: templateName, dueDateOffsetDays, dueTimeHour, dueTimeMinutes, closesDateOffsetDays, isAM, doSelect: true })
        const openDate = await page.$eval('input[name="tasking_plans[0].opens_at"]', el => (el as any).defaultValue)
        let updatedDueDate

        // Due date should change
        const dueAt = await page.$eval('input[name="tasking_plans[0].due_at"]', el => (el as any).defaultValue)
        const dueDate = moment(dueAt, format).toISOString()
        updatedDueDate = dueDate

        // Compute the due date from the open date
        const hour = isAM ? parseInt(dueTimeHour, 10) - 12 : parseInt(dueTimeHour, 10)
        const expectedDueDate = moment(openDate, format)
            .add(parseInt(dueDateOffsetDays, 10), 'days')
            .set({ hour, minutes: parseInt(dueTimeMinutes, 10) })
            .toISOString()
        expect(dueDate).toEqual(expectedDueDate)
        // Closes date should change
        const closesAt = await page.$eval('input[name="tasking_plans[0].closes_at"]', el => (el as any).defaultValue)
        const closesDate = moment(closesAt, format).toISOString()
        // Compute the closes date from the due date
        const expectedDueDate2 = moment(updatedDueDate)
            .add(parseInt(closesDateOffsetDays, 10), 'days')
            .toISOString()
        expect(closesDate).toEqual(expectedDueDate2)
    })

    it('changes open dates to update other dates', async () => {
        const templateName = 'Template to update dates'
        const dueDateOffsetDays = '3', dueTimeHour = '19', dueTimeMinutes = '15', closesDateOffsetDays = '10', isAM = false

        await visitPage(page, '/course/2/assignment/edit/homework/new')
        await disableTours()
        await fillDetails()

        await addTemplate({ name: templateName, dueDateOffsetDays, dueTimeHour, dueTimeMinutes, closesDateOffsetDays, isAM, doSelect: true })
        await page.click('input[name="tasking_plans[0].opens_at"]')
        await page.type('input[name="tasking_plans[0].opens_at"]', typedOpenDate)
        await page.click('.oxdt-ok button')

        const openDate = await page.$eval('input[name="tasking_plans[0].opens_at"]', el => (el as any).defaultValue)

        const dueAt = await page.$eval('input[name="tasking_plans[0].due_at"]', el => (el as any).defaultValue)
        const dueDate = moment(dueAt, format).toISOString()
        let updatedDueDate = dueDate
        const hour = isAM ? parseInt(dueTimeHour, 10) - 12 : parseInt(dueTimeHour, 10)
        const expectedDueDate = moment(openDate, format)
            .add(parseInt(dueDateOffsetDays, 10), 'days')
            .set({ hour, minutes: parseInt(dueTimeMinutes, 10) })
            .toISOString()
        expect(dueDate).toEqual(expectedDueDate)

        const closesAt = await page.$eval('input[name="tasking_plans[0].closes_at"]', el => (el as any).defaultValue)
        const closesDate = moment(closesAt, format).toISOString()
        // Compute the closes date from the due date
        const expectedDueDate2 = moment(updatedDueDate)
            .add(parseInt(closesDateOffsetDays, 10), 'days')
            .toISOString()
        expect(closesDate).toEqual(expectedDueDate2)
    })

    it('updates open date and time manually', async () => {
        await visitPage(page, '/course/2/assignment/edit/homework/new')
        await disableTours()

        await page.click('input[name="tasking_plans[0].opens_at"]')
        await page.click('.oxdt-cell-inner:has-text("1")')
        await page.click('.oxdt-time-panel-column:nth-child(1) .oxdt-time-panel-cell-inner:has-text("08")')
        await page.click('.oxdt-time-panel-column:nth-child(2) .oxdt-time-panel-cell-inner:has-text("10")')
        await page.click('.oxdt-time-panel-column:nth-child(3) .oxdt-time-panel-cell-inner:has-text("PM")')
        await page.click('.oxdt-ok button')
        expect(await page.$eval('input[name="tasking_plans[0].opens_at"]', el => (el as any).defaultValue)).toContain('1 | 08:10 PM')
    })

    it('updates date when pivot date is updated', async () => {
        await visitPage(page, '/course/2/assignment/edit/homework/new')
        await disableTours()

        // force update the closes date
        await page.click('input[name="tasking_plans[0].closes_at"]')
        await page.fill('input[name="tasking_plans[0].closes_at"]', typedClosesDate)
        await page.click('.oxdt-ok button')
        const currentClosesDate = await page.$eval('input[name="tasking_plans[0].closes_at"]', el => (el as any).defaultValue)
        // force update the open date
        await page.click('input[name="tasking_plans[0].opens_at"]')
        await page.fill('input[name="tasking_plans[0].opens_at"]', typedOpenDate)
        // After opening the closes date time picker modal, it gets the two OK buttons
        await page.click(':nth-match(.oxdt-ok button, 2)')
        // after changing the open date, no dates should be changed because the interval between open/due/close date has changed
        expect(await page.$eval('input[name="tasking_plans[0].closes_at"]', el => (el as any).defaultValue)).toEqual(currentClosesDate)
    })

    it('shows error if due date is before open date', async () => {
        const typedDueDate = moment(typedOpenDate, 'MMM D [| 05:00 PM]').subtract(1, 'day').format('MMM D [| 05:00 PM]')
        await visitPage(page, '/course/2/assignment/edit/external/new')
        await disableTours()

        await page.type('input[name="title"]', 'test assignment #1')
        await page.click('input[name="tasking_plans[0].opens_at"]')
        await page.fill('input[name="tasking_plans[0].opens_at"]', typedOpenDate, { force: true } as any)
        await page.click('.oxdt-ok button')
        await page.click('input[name="tasking_plans[0].due_at"]')
        await page.fill('input[name="tasking_plans[0].due_at"]', typedDueDate, { force: true } as any)
        await page.click(':nth-match(.oxdt-ok button, 2)')
        expect(await page.textContent('testEl=date-error-message')).toContain('Due time cannot be before the open time')
        expect(await (page as any).isDisabled('testEl=save-draft-button')).toBe(true)
    })

    // When typing the date, it goes to the next valid date
    it('shows error if closes date is before due date', async () => {
        const typedClosesDate = moment(typedDueDate, 'MMM D [| 05:00 PM]').subtract(1, 'day').format('MMM D [| 05:00 PM]')
        await visitPage(page, '/course/2/assignment/edit/homework/new')
        await disableTours()

        await page.type('input[name="title"]', 'test assignment #1')
        await page.click('input[name="tasking_plans[0].opens_at"]')
        await page.fill('input[name="tasking_plans[0].opens_at"]', typedOpenDate)
        await page.click('.oxdt-ok button')
        await page.click('input[name="tasking_plans[0].due_at"]')
        await page.fill('input[name="tasking_plans[0].due_at"]', typedDueDate)
        await page.click(':nth-match(.oxdt-ok button, 2)')
        await page.click('input[name="tasking_plans[0].closes_at"]')
        await page.fill('input[name="tasking_plans[0].closes_at"]', typedClosesDate)
        await page.click(':nth-match(.oxdt-ok button, 3)')
        expect(await page.textContent('testEl=date-error-message')).toContain('Close time cannot be before the due time')
    })

    it('disable the save as draft button if no title is given to the assignment', async () => {
        await visitPage(page, '/course/2/assignment/edit/external/new')
        await disableTours()
        expect(await (page as any).isDisabled('testEl=save-draft-button')).toBe(true)
        await page.type('input[name="title"]', 'add assignment name, now save as draft should be enabled')
        expect(await (page as any).isDisabled('testEl=save-draft-button')).toBe(false)
    })
})
