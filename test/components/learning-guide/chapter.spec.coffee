{Testing, expect, sinon, _} = require '../helpers/component-testing'

Chapter = require '../../../src/components/learning-guide/chapter'

GUIDE = require '../../../api/user/courses/1/guide.json'

describe 'Learning Guide Chapter Panel', ->


  beforeEach ->
    @props = {
      chapter: GUIDE.children[0]
      courseId: '1'
      onPractice: sinon.spy()
    }

  it 'reports how many problems were worked', ->
    Testing.renderComponent( Chapter, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.amount-worked').textContent).to.equal('10 problems worked in this chapter')

  it 'displays the title', ->
    Testing.renderComponent( Chapter, props: @props ).then ({dom}) =>
      expect(dom.querySelector('.title').textContent).to.equal(@props.chapter.title)
