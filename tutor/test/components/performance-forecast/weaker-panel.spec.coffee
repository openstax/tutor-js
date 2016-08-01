{Testing, expect, sinon, _} = require '../helpers/component-testing'

Weaker = require '../../../src/components/performance-forecast/weaker-panel'
PerformanceForecast = require '../../../src/flux/performance-forecast'
GUIDE = require '../../../api/courses/1/guide.json'
COURSE_ID = '1'
describe 'Weaker Section Panel', ->

  beforeEach ->
    PerformanceForecast.Student.actions.loaded(GUIDE, COURSE_ID)
    @props = {
      courseId: '1'
      sections: PerformanceForecast.Student.store.getAllSections(COURSE_ID)
      weakerTitle: 'Weaker'
      weakerExplanation: 'Stuff you suck at'
      weakerEmptyMessage: 'Not enough data'
      sampleSizeThreshold: 3
    }

  it 'displays the title', ->
    Testing.renderComponent( Weaker, props: @props ).then ({dom}) =>
      expect(dom.querySelector('.title').textContent).to.equal(@props.weakerTitle)


  it 'hides practice button if onPractice property is not given', ->
    Testing.renderComponent( Weaker, props: @props ).then ({dom}) ->
      practice = dom.querySelector('.practice.btn')
      expect(practice).to.be.null

  it 'can practice sections if onPractice property is given', ->
    @props.onPractice = sinon.spy()
    Testing.renderComponent( Weaker, props: @props ).then ({dom}) ->
      practice = dom.querySelector('.practice.btn')
      expect(practice).to.not.be.null
      Testing.actions.click(practice)
      expect(Testing.router.transitionTo).to.have.been.calledWith(
        'viewPractice', { courseId: COURSE_ID }, { page_ids: ["6", "5"] }
      )

  it 'does not render if there are no sections', ->
    @props.sections = []
    Testing.renderComponent( Weaker, props: @props ).then ({dom}) ->
      expect( dom ).to.be.null

  it 'hides practice button if no sections are shown', ->
    section = _.first(@props.sections)
    @props.sections = [section]

    Testing.renderComponent( Weaker, props: @props ).then ({dom}) ->
      expect( dom.querySelector('.practice.btn' ) ).to.not.be.null

    section.sample_size = 1
    section.sample_size_interpretation = 'below'

    Testing.renderComponent( Weaker, props: @props ).then ({dom}) ->
      expect( dom.querySelector('.practice.btn' ) ).to.be.null
