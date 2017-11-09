{Testing, expect, _} = require '../helpers/component-testing'

{CoursePracticeActions, CoursePracticeStore} = require '../../../src/flux/practice'
PerformanceForecast = require '../../../src/flux/performance-forecast'
Button = require '../../../src/components/performance-forecast/practice-button'

COURSE_ID  = '1'
GUIDE_DATA = require '../../../api/courses/1/guide.json'

failToCreatePractice = (pageIds) ->
  params =
    page_ids: pageIds

  CoursePracticeActions.create(COURSE_ID, params)
  CoursePracticeActions._failed({}, COURSE_ID, params)

describe 'Learning Guide Practice Button', ->

  beforeEach ->
    PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID)

  afterEach ->
    CoursePracticeActions.reset()

  it 'can be rendered and sets the name', ->
    Testing.renderComponent( Button,
      props: { courseId: COURSE_ID, title: 'Practice moar' }
    ).then ({dom}) ->
      expect(dom.textContent).to.equal('Practice moar')


  it 'practices pages', ->
    Testing.renderComponent( Button, props: {
      courseId: COURSE_ID
      title: 'Practice moar'
      sections: GUIDE_DATA.children[0].children
    }).then ({dom}) ->
      Testing.actions.click(dom)
      expect(Testing.router.history.push).to.have.been.calledWith( 'viewPractice',
        { courseId: COURSE_ID }, { page_ids: ['2', '3'] }
      )

  it 'is disabled if no page ids exist', ->
    newdata = {"title": "Physics"}
    PerformanceForecast.Student.actions.loaded(newdata, COURSE_ID)
    Testing.renderComponent( Button,
      props: { courseId: COURSE_ID, title: 'title' }
    ).then ({dom, element}) ->
      expect(dom.disabled).to.be.true

  it 'is disabled if page ids exists and practice has previously failed to create', ->
    failToCreatePractice(['2', '3'])

    Testing.renderComponent( Button, props: {
      courseId: COURSE_ID
      title: 'Practice moar'
      sections: GUIDE_DATA.children[0].children
    }).then ({dom, element}) ->
      expect(dom.disabled).to.be.true
