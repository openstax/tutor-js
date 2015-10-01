{Testing, expect, sinon, _} = require '../helpers/component-testing'

Section = require '../../../src/components/learning-guide/section'

GUIDE = require '../../../api/user/courses/1/guide.json'

describe 'Learning Guide Section Panel', ->


  beforeEach ->
    @props = {
      section: GUIDE.children[0].children[0]
      courseId: '1'
      onPractice: sinon.spy()
    }

  it 'displays the title', ->
    Testing.renderComponent( Section, props: @props ).then ({dom}) =>
      expect(dom.querySelector('.title').textContent).to.equal(@props.section.title)

  it 'reports how many problems were worked', ->
    count = @props.section.clue.unique_learner_count
    total = @props.section.questions_answered_count
    if count > 1
      pluralA = 'students'
    else
      pluralA = 'student'
    if total > 1
      pluralB = 'problems'
    else
      pluralB = 'problem'

    Testing.renderComponent( Section, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.amount-worked').textContent).to
      .equal("#{count} #{pluralA} have worked #{total} #{pluralB}")
