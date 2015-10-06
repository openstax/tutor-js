{Testing, expect, _, ReactTestUtils} = require '../helpers/component-testing'

PerformanceForecast = require '../../../src/flux/performance-forecast'
PracticeButton = require '../../../src/components/performance-forecast/practice-button'
Guide = require '../../../src/components/student-dashboard/progress-guide'

COURSE_ID  = '1'
GUIDE_DATA = require '../../../api/courses/1/guide.json'

describe 'Student Dashboard Progress Panel', ->

  it 'renders practice button', ->
    PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID)
    Testing.renderComponent( Guide,
      props: { courseId: COURSE_ID, sampleSizeThreshold: 3 }
    ).then ({dom, element}) ->
      expect(dom).not.to.be.null
      expect(dom.querySelector('button.practice')).not.to.be.null

  it 'is disabled if Student Scores sections are empty', ->
    PerformanceForecast.Student.actions.loaded({"title": "Physics"}, COURSE_ID)
    Testing.renderComponent( Guide,
      props: { courseId: COURSE_ID, sampleSizeThreshold: 3 }
    ).then ({dom, element}) ->
      expect(_.toArray(dom.classList)).to.include('empty')

  it 'views the guide', ->
    PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID)
    Testing.renderComponent( Guide,
      props: { courseId: COURSE_ID, sampleSizeThreshold: 3 }
    ).then ({dom, element}) ->
      Testing.actions.click(dom.querySelector('.view-performance-forecast'))
      expect(Testing.router.transitionTo).to.have.been.calledWith(
        'viewPerformanceForecast', { courseId: COURSE_ID }
      )

  it 'practices weak sections when they are available', ->
    PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID)
    Testing.renderComponent( Guide,
      props: { courseId: COURSE_ID, sampleSizeThreshold: 3 }
    ).then ({element}) ->
      btn = ReactTestUtils.findRenderedComponentWithType(element, PracticeButton)
      expect(btn).not.to.be.null
      expect( btn.props.sections ).to.deep.equal(
        PerformanceForecast.Helpers.weakestSections(
          PerformanceForecast.Student.store.getAllSections(COURSE_ID)
        )
      )

  it 'practices recent sections when weaker sectsions are not available', ->
    data = _.clone(GUIDE_DATA)
    data.children = [ data.children[0] ]
    # mark all sections as un-forecastable
    for section in data.children[0].children
      section.clue.sample_size = 1
      section.clue.sample_size_interpretation = "below"
    PerformanceForecast.Student.actions.loaded(data, COURSE_ID)

    Testing.renderComponent( Guide,
      props: { courseId: COURSE_ID, sampleSizeThreshold: 3 }
    ).then ({dom, element}) ->
      btn = ReactTestUtils.findRenderedComponentWithType(element, PracticeButton)
      expect( btn.props.sections ).to.deep.equal(
        PerformanceForecast.Helpers.recentSections(
          PerformanceForecast.Student.store.getAllSections(COURSE_ID)
        )
      )
