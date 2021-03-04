import { visitPage, disableTours, setRole, setTimeouts } from './helpers'

// const setupDashboard = () => {
//     cy.setRole('student')
//     cy.visit('/course/2');
//     cy.disableTours();
// }

// context('Dashboard', () => {

//     afterEach(() => {
//         cy.setRole('teacher');
//     })
  
//     it('switches tabs', () => {
//         setupDashboard();
//         cy.getTestElement('all-past-work-tab').click()
//     });

//     it('loads assignments', () => {
//         withScreenSizes(() => {
//             setupDashboard();
//             cy.getTestElement('all-past-work-tab').click()
//             cy.get('.task.homework').first().click()
//             cy.getTestElement('student-task').should('exist')
//         })
//     })
// });

describe('Student Dashboard', () => {
    beforeEach(async () => {
        await setRole('student')
        await setTimeouts()
        await visitPage(page, '/course/2');
        await disableTours()
    })

    it('switches tabs', async () => {
        await page.click('testEl=all-past-work-tab')
    });

    it.only('loads assignments', async () => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.click('testEl=all-past-work-tab');
        await page.click('.task.homework');
        await expect(page).toHaveSelector('testEl=student-task')
        // withScreenSizes(async () => {
        //     await page.click('testEl=all-past-work-tab');
        //     await page.click('.task.homework');
        //     await expect(page).toHaveSelector('testEl=student-task')
        // })
    })
})
