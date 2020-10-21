context('Student Tasks', () => {

  beforeEach(() => {
    cy.viewport(1200, 720)
    cy.setRole('student')
  });

  // eslint-disable-next-line
  const submitAnswer = () => {
    cy.get('.exercise-step').then(st => {
      const fr = st.find('[data-test-id="free-response-box"]')
      if (fr.length > 0) {
        cy.wrap(fr).type('this is a answer answering and fully explaining my reasoning for the question')
        cy.getTestElement('submit-answer-btn').click()
      }
    })
    cy.getTestElement('answer-choice-a').click()
    cy.getTestElement('submit-answer-btn').click()
    cy.getTestElement('continue-btn').click()
  }

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

  it('advances after answering a free-response only question', () => {
    cy.visit('/course/1/task/3') // task id 3 is a hardcoded WRM task
    cy.disableTours();
    cy.get('.icon-instructions').click()
    cy.getTestElement('homework-instructions').should('exist')
    cy.getTestElement('value-prop-continue-btn').click();
    cy.getTestElement('student-free-response').should('exist')
    cy.getTestElement('free-response-box').type('this is a answer answering and fully explaining my reasoning for the question')
    cy.getTestElement('submit-answer-btn').click()
    cy.location('pathname').should('contain', '/course/1/task/3/step')
  })

  it('can change and re-submit answers to questions', () => {
    cy.visit('/course/1/task/2')
    cy.get('.sticky-table [data-step-index=3]').click({ force: true })
    cy.get('.exercise-step').then(st => {
      const fr = st.find('[data-test-id="free-response-box"]')
      if (fr.length > 0){
        cy.wrap(fr).type('why do i need to fill this out?')
        cy.getTestElement('submit-answer-btn').click()
      }
    })
    cy.getTestElement('answer-choice-b').then( bt => {
      if (!bt.closest('.answer-checked').length) {
        cy.getTestElement('answer-choice-b').click()
        cy.getTestElement('submit-answer-btn').click()
      }
    })
    cy.getTestElement('continue-btn').click()
    cy.get('.sticky-table [data-step-index=4]').should('have.class', 'current-step')
    // go back and resubmit
    cy.get('.sticky-table [data-step-index=3]').click({ force: true })
    cy.get('.answer-checked [data-test-id="answer-choice-b"]').should('exist')

    cy.getTestElement('answer-choice-c').click()
    cy.get('.answer-checked [data-test-id="answer-choice-c"]').should('exist')
    cy.getTestElement('submit-answer-btn').click()
    cy.getTestElement('continue-btn').click()
  })
  
  it('should show late clock icon and the late points info, if task step is late', () => {
    cy.visit('/course/1/task/4')
    cy.get('[data-test-id="late-icon"]').should('exist')
    cy.get('.isLateCell').first().trigger('mouseover').then(() => {
      cy.get('[data-test-id="late-info-points-table"]').should('exist')
    })
  })

  it('should show word limit error message and disable submit button if response is over 500 words', () => {
    cy.visit('/course/1/task/3')
    cy.getTestElement('student-free-response').should('exist')
    cy.getTestElement('free-response-box').type(longFreeResponseAnswer)
    cy.get('.word-limit-error-info').should('exist')
    cy.getTestElement('submit-answer-btn').should('be.disabled')
  })

  it('should be able to question to my practice', () => {
    cy.visit('/course/1/task/2')
    cy.get('.sticky-table [data-step-index=3]').click({ force: true })
    cy.get('.exercise-step').then(st => {
      const fr = st.find('[data-test-id="free-response-box"]')
      if (fr.length > 0){
        cy.wrap(fr).type('test')
        cy.getTestElement('submit-answer-btn').click()
      }
    })
    cy.getTestElement('save-practice-button').should('exist');
    cy.getTestElement('save-practice-button').should('have.text', 'Remove from practice');
    cy.getTestElement('save-practice-button').click();
    cy.getTestElement('save-practice-button').should('have.text', 'Save to practice');
  })

  it('deals with steps being removed', () => {
    const taskId = 8
    cy.visit(`/course/1/task/${taskId}`)
    // FIXME - this has infinite loop and eventually crashes cypress
    
    // cy.get('.task-homework').then(card => {
    //   let btn = card.find('[data-test-id="value-prop-continue-btn"]')
    //   while(btn.length > 0) {
    //     cy.wrap(btn).click()
    //     btn = card.find('[data-test-id="value-prop-continue-btn"]')
    //   }
    // })
    //    submitAnswer()

    // cy.window().then(win => {
    //   win._MODELS.courses.get(1).studentTasks.get(taskId).steps[3].type = 'placeholder'
    // })
    // range(2).forEach(submitAnswer)
    // cy.getTestElement('individual-review-intro-value-prop').should('exist')
    // cy.getTestElement('value-prop-continue-btn').click()
    // cy.get('.exercise-step').should('exist')
  })
})
