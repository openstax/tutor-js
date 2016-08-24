{Testing, expect, sinon, _} = require '../helpers/component-testing'

{CoursePracticeActions, CoursePracticeStore} = require '../../../src/flux/practice'
Bar = require '../../../src/components/performance-forecast/progress-bar'
COURSE_ID = '1'

failToCreatePractice = (pageIds) ->
  params =
    page_ids: pageIds

  CoursePracticeActions.create(COURSE_ID, params)
  CoursePracticeActions._failed({}, COURSE_ID, params)

didRouterGoToPractice = ->
  expect(Testing.router.transitionTo).to.have.been.calledWith( 'viewPractice',
    { courseId: COURSE_ID }, { page_ids: ['2', '3'] }
  )

describe 'Learning Guide Progress Bar', ->

  beforeEach ->
    @props = {
      courseId: COURSE_ID
      canPractice: true
      sampleSizeThreshold: 10
      section:
        page_ids: ['2', '3']
        clue: { value: 0.82, sample_size: 2, sample_size_interpretation: 'high', magic: true }
    }

  afterEach ->
    CoursePracticeActions.reset()

  it 'calls practice callback', ->
    Testing.renderComponent( Bar, props: @props ).then ({dom}) =>
      Testing.actions.click(dom)
      didRouterGoToPractice()

  it 'renders the progress bar with correct level', ->
    Testing.renderComponent( Bar, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.progress-bar').style.width).to.equal('82%')

  it 'is disabled if page ids exists and practice has previously failed to create', ->
    failToCreatePractice(['2', '3'])

    Testing.renderComponent( Bar, props: @props ).then ({dom}) ->
      expect(dom.disabled).to.be.true

  describe 'when sample_size_interpretation is below', ->

    it 'does not render the bar', ->
      @props.section.clue.sample_size_interpretation = 'below'
      Testing.renderComponent( Bar, props: @props).then ({dom}) ->
        expect(dom.querySelector('.progress-bar')).to.be.null

    describe 'when threshold is met', ->

      it 'renders if threshold is exceeded', ->
        @props.section.clue.sample_size_interpretation = 'below'
        @props.section.clue.sample_size = 2
        @props.sampleSizeThreshold = 1 # less than the clue sample_size of 2
        Testing.renderComponent( Bar, props: @props).then ({dom}) =>
          expect(dom.querySelector('.progress-bar')).not.to.be.null
          Testing.actions.click(dom)
          didRouterGoToPractice()

      it 'renders if sample threshold is equal', ->
        @props.section.clue.sample_size_interpretation = 'below'
        # both are equal
        @props.sampleSizeThreshold = @props.section.clue.sample_size = 10
        Testing.renderComponent( Bar, props: @props).then ({dom}) =>
          expect(dom.querySelector('.progress-bar')).not.to.be.null
          Testing.actions.click(dom)
          didRouterGoToPractice()
