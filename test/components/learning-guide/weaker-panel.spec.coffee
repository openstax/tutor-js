{Testing, expect, sinon, _} = require '../helpers/component-testing'

Weaker = require '../../../src/components/learning-guide/weaker-panel'
LearningGuide = require '../../../src/flux/learning-guide'
GUIDE = require '../../../api/courses/1/guide.json'

describe 'Weaker Section Panel', ->

  beforeEach ->
    LearningGuide.Student.actions.loaded(GUIDE, '1')
    @props = {
      courseId: '1'
      sections: LearningGuide.Student.store.getAllSections('1')
      weakerTitle: 'Weaker'
      weakerExplanation: 'Stuff you suck at'
      weakerEmptyMessage: 'Not enough data'
      sectionCount: 2
      minimumSectionCount: 1
      onPractice: sinon.spy()
    }

  it 'displays the title', ->
    Testing.renderComponent( Weaker, props: @props ).then ({dom}) =>
      expect(dom.querySelector('.title').textContent).to.equal(@props.weakerTitle)

  it 'displays empty', ->
    @props.minimumSectionCount = 8
    Testing.renderComponent( Weaker, props: @props ).then ({dom}) =>
      expect(dom.querySelector('.lacking-data')).not.to.be.null
      expect(dom.querySelector('.lacking-data').textContent).to.equal(@props.weakerEmptyMessage)

  it 'renders forecast bars', ->
    Testing.renderComponent( Weaker, props: @props ).then ({dom}) ->
      expect(dom.querySelectorAll('.section').length).to.equal(2)
      expect(dom.querySelector('.section:first-child .title').textContent).to
        .equal("Newton's First Law of Motion: Inertia")
      expect(dom.querySelector('.section:last-child .title').textContent).to
        .equal("Force")
