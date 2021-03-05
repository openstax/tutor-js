import { visitPage, disableTours, setRole, setTimeouts } from './helpers'

describe('Student Tasks', () => {

    beforeEach(async () => {
        await page.setViewportSize({ width: 1200, height: 720 })
        await setTimeouts()
        setRole('student')
    });

    const longFreeResponseAnswer = ' dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum varius' + 
    'duis at consectetur lorem donec massa sapien faucibus et molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas' + 
    'purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae auctor eu augue ut lectus arcu bibendum at varius vel pharetra vel turpis nunc eget lorem dolor sed viverra ipsum nunc' + 
    'aliquet bibendum enim facilisis gravida neque convallis a cras semper auctor neque vitae tempus quam pellentesque nec nam aliquam sem et tortor consequat id porta nibh venenatis cras sed' + 
    'felis eget velit aliquet sagittis id consectetur purus ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt vitae semper quis lectus nulla at volutpat diam ut venenatis' + 
    'tellus in metus vulputate eu scelerisque felis imperdiet proin fermentum leo vel orci porta non pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt' + 
    'eget nullam non nisi est sit amet facilisis magna etiam tempor orci eu lobortis elementum nibh tellus molestie nunc non blandit massa enim nec dui nunc mattis enim ut tellus elementum sagittis' + 
    'vitae et leo duis ut diam quam nulla porttitor massa id neque aliquam vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum' + 
    'sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel risus commodo viverra maecenas accumsan lacus vel facilisis' + 
    'volutpat est velit egestas dui id ornare arcu odio ut sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor elit sed vulputate mi sit amet mauris' + 
    'commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit amet mattis vulputate enim nulla aliquet porttitor' + 
    'lacus luctus accumsan tortor posuere ac ut consequat semper viverra nam libero justo laoreet sit amet cursus sit amet dictum sit amet justo donec enim diam vulputate ut pharetra sit amet aliquam' +
    'id diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna' + 
    'neque viverra justo nec ultrices dui sapien eget mi proin sed libero enim sed faucibus turpis in eu mi bibendum neque egestas congue quisque egestas diam in arcu cursus euismod quis viverra nibh' + 
    'cras pulvinar mattis nunc sed blandit libero volutpat sed cras ornare arcu dui vivamus arcu felis bibendum ut tristique et egestas quis ipsum suspendisse ultrices gravida dictum fusce ut placerat' +
    'orci nulla pellentesque dignissim enim sit amet venenatis urna cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla ut morbi tincidunt augue interdum velit euismod in pellentesque' +
    'massa placerat duis ultricies lacus sed turpis tincidunt id aliquet risus feugiat in ante metus dictum at tempor commodo ullamcorper a lacus vestibulum sed arcu non odio euismod lacinia at quis' + 
    'risus sed vulputate odio ut enim blandit volutpat maecenas olutpatv blandit aliquam etiam risus sed vulputate odio ut enim blandit volutpat maecenas olutpatv blandit aliquam etiam landit volutpat' +
    'maecenas olutpatv blandit aliquam etiam maecenas olutpatv blandit aliquam etiam'

    it('advances after answering a free-response only question', async () => {
        await visitPage(page, '/course/1/task/3') // task id 3 is a hardcoded WRM task
        disableTours()
        await page.click('.icon-instructions')
        await expect(page).toHaveSelector('testEl=homework-instructions')
        await page.click('testEl=value-prop-continue-btn')
        await expect(page).toHaveSelector('testEl=student-free-response')
        await page.type('testEl=free-response-box', 'this is a answer answering and fully explaining my reasoning for the question')
        await page.click('testEl=submit-answer-btn')
        expect(await page.evaluate(() => document.location.pathname)).toContain('/course/1/task/3/step')
        
    })

    it('can change and re-submit answers to questions', async () => {
        await visitPage(page, '/course/1/task/2')
        //Verify: after clicking on a two-step question, the two step question icon shows up, moving all the data-step-index by 1
        await page.click('.sticky-table [data-step-index="3"]')

        //check if text area for free response is available
        await page.waitForSelector('.exercise-step [data-test-id="free-response-box"]', { timeout: 2000 })
            .then(async () => {
                await page.type('.exercise-step [data-test-id="free-response-box"]', 'why do i need to fill this out?')
                await page.click('testEl=submit-answer-btn')
            })
            // free response is submitted
            .catch(() => {})

        //check if answer b is checked
        await page.waitForSelector('.answer-checked [data-test-id="answer-choice-b"]', { timeout: 2000 })
            .then(async () => {
                await page.click('testEl=continue-btn')
            })
            .catch(async () => {
                await page.click('testEl=answer-choice-b')
                await page.click('testEl=submit-answer-btn')
            })

        // go back and resubmit
        await page.click('.sticky-table [data-step-index="4"]')
        await expect(page).toHaveSelector('.answer-checked [data-test-id="answer-choice-b"]')
        await page.click('testEl=answer-choice-c')
        await expect(page).toHaveSelector('.answer-checked [data-test-id="answer-choice-c"]')
        await page.click('testEl=submit-answer-btn')
        await page.click('testEl=continue-btn')
    })
  
    it('should show late clock icon and the late points info, if task step is late', async () => {
        await visitPage(page, '/course/1/task/4')
        await expect(page).toHaveSelector('testEl=late-icon')
        await page.hover(':nth-match(.isLateCell, 1)')
        await expect(page).toHaveSelector('testEl=late-info-points-table')
    })

    it('should show word limit error message and disable submit button if response is over 500 words', async () => {
        await visitPage(page, '/course/1/task/3') // task id 3 is a hardcoded WRM task
        await expect(page).toHaveSelector('testEl=student-free-response')
        await page.type('testEl=free-response-box', longFreeResponseAnswer)
        await expect(page).toHaveSelector('.word-limit-error-info')
        await expect(page).toHaveSelector('testEl=submit-answer-btn-disabled')
    })

    it('should be able to save question to my practice', async () => {
        await visitPage(page, '/course/1/task/2') 
        await page.click('.sticky-table [data-step-index="4"]')
        // start fresh - deleting the practice questions from course
        await page.evaluate(() => {
            window._MODELS.courses.get(1).practiceQuestions.clear()
        })

        await page.type('.exercise-step [data-test-id="free-response-box"]', 'why do i need to fill this out?')
        await page.click('testEl=submit-answer-btn')
        await expect(page).toHaveSelector('testEl=save-practice-button')
        await expect(page).toHaveText('testEl=save-practice-button', 'Save to practice')
    })
})
