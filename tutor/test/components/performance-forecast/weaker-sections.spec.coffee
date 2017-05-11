{Testing, expect, sinon, _} = require '../helpers/component-testing'

Sections = require '../../../src/components/performance-forecast/weaker-sections'
PerformanceForecast = require '../../../src/flux/performance-forecast'
GUIDE = require '../../../api/courses/1/guide.json'

describe 'Weaker Sections listing', ->

  beforeEach ->
    PerformanceForecast.Student.actions.loaded(GUIDE, '1')
    @props = {
      courseId: '1'
      sections: PerformanceForecast.Student.store.getAllSections('1')
      weakerEmptyMessage: 'Not enough data'
    }

  it 'renders forecast bars', ->
    Testing.renderComponent( Sections, props: @props ).then ({dom}) ->
      expect(dom.querySelectorAll('.section').length).to.equal(2)
      expect(dom.querySelector('.section:first-child .title').textContent).to
        .equal("Newton's First Law of Motion: Inertia")
      expect(dom.querySelector('.section:last-child .title').textContent).to
        .equal("Force")

  it 'renders empty message when less than 2 sections are valid', ->
    # set everything to be invalid
    for s in @props.sections
      s.clue.is_real = false

    Testing.renderComponent( Sections, props: @props ).then ({dom}) =>
      expect(dom.querySelector('.lacking-data')).not.to.be.null
      expect(dom.querySelector('.lacking-data').textContent).to.equal(@props.weakerEmptyMessage)

    # flip one back to valid and the no-data message should still render
    @props.sections[0].clue.is_real = true
    Testing.renderComponent( Sections, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.lacking-data')).not.to.be.null

    # It should not render when another is marked as valid
    @props.sections[1].clue.is_real = true
    Testing.renderComponent( Sections, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.lacking-data')).to.be.null
