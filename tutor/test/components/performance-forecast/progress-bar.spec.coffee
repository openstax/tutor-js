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
  expect(Testing.router.history.push).to.have.been.calledWith( 'viewPractice',
    { courseId: COURSE_ID }, { page_ids: ['2', '3'] }
  )

describe 'Learning Guide Progress Bar', ->

  beforeEach ->
    @props = {
      courseId: COURSE_ID
      canPractice: true
      section:
        page_ids: ['2', '3']
        clue: { minimum: 0.8, most_likely: 0.82, maximum: 0.85, is_real: true }
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

  describe 'when the clue is not real', ->

    it 'does not render the bar', ->
      @props.section.clue.is_real = false
      Testing.renderComponent( Bar, props: @props).then ({dom}) ->
        expect(dom.querySelector('.progress-bar')).to.be.null

  describe 'when the clue is real', ->

    it 'renders the bar', ->
      @props.section.clue.is_real = true
      Testing.renderComponent( Bar, props: @props).then ({dom}) =>
        expect(dom.querySelector('.progress-bar')).not.to.be.null
        Testing.actions.click(dom)
        didRouterGoToPractice()
