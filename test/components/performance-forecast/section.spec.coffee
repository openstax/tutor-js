{Testing, expect, sinon, _} = require '../helpers/component-testing'

Section = require '../../../src/components/performance-forecast/section'

GUIDE = require '../../../api/user/courses/1/guide.json'

pluralize = require 'pluralize'

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
    total = @props.section.questions_answered_count

    Testing.renderComponent( Section, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.amount-worked').textContent).to
      .equal("#{pluralize(' problems', total, true)} worked in this section")
