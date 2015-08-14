{Testing, expect, sinon, _} = require '../helpers/component-testing'

Sections = require '../../../src/components/learning-guide/weaker-sections'
LearningGuide = require '../../../src/flux/learning-guide'
GUIDE = require '../../../api/courses/1/guide.json'

describe 'Weaker Sections listing', ->

  beforeEach ->
    LearningGuide.Student.actions.loaded(GUIDE, '1')
    @props = {
      courseId: '1'
      sections: LearningGuide.Student.store.getAllSections('1')
      weakerTitle: 'Weaker'
      weakerExplanation: 'Stuff you suck at'
      weakerEmptyMessage: 'Not enough data'
      sectionCount: 2
      onPractice: sinon.spy()
    }

  it 'renders forecast bars', ->
    Testing.renderComponent( Sections, props: @props ).then ({dom}) ->
      expect(dom.querySelectorAll('.section').length).to.equal(2)
      expect(dom.querySelector('.section:first-child .title').textContent).to
        .equal("Newton's First Law of Motion: Inertia")
      expect(dom.querySelector('.section:last-child .title').textContent).to
        .equal("Force")

  it 'renders empty message when no sections are weak', ->
    section = _.first(@props.sections)
    @props.sections = [section]
    section.sample_size = 1
    section.sample_size_interpretation = 'below'

    Testing.renderComponent( Sections, props: @props ).then ({dom}) =>
      expect(dom.querySelector('.lacking-data')).not.to.be.null
      expect(dom.querySelector('.lacking-data').textContent).to.equal(@props.weakerEmptyMessage)
