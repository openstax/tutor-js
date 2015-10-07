{Testing, expect, sinon, _} = require '../helpers/component-testing'

Chapter = require '../../../src/components/performance-forecast/chapter'

GUIDE = require '../../../api/user/courses/1/guide.json'

pluralize = require 'pluralize'

describe 'Learning Guide Chapter Panel', ->


  beforeEach ->
    @props = {
      chapter: GUIDE.children[0]
      courseId: '1'
      onPractice: sinon.spy()
    }

  it 'reports how many problems were worked', ->
    total = @props.chapter.questions_answered_count

    Testing.renderComponent( Chapter, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.amount-worked').textContent).to
      .equal("#{pluralize(' problems', total, true)} worked in this chapter")

  it 'displays the title', ->
    Testing.renderComponent( Chapter, props: @props ).then ({dom}) =>
      expect(dom.querySelector('.title').textContent).to.equal(@props.chapter.title)
