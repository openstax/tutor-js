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

  it 'renders expanded and can be toggled', ->
    Testing.renderComponent( Chapter, props: @props ).then ({dom}) ->
      expect(_.toArray(dom.classList)).to.include('expanded')
      expect(dom.querySelector('.view-toggle').textContent).to.equal('View Less')
      Testing.actions.clickButton(dom, '.view-toggle')
      expect(_.toArray(dom.classList)).to.include('collapsed')
      expect(_.toArray(dom.classList)).to.not.include('expanded')
      expect(dom.querySelector('.view-toggle').textContent).to.equal('View More')

  it 'reports how many problems were worked', ->
    Testing.renderComponent( Chapter, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.amount-worked').textContent).to.equal('10 problems worked')

  it 'displays the title', ->
    Testing.renderComponent( Chapter, props: @props ).then ({dom}) =>
      expect(dom.querySelector('.chapter-title').textContent).to.equal(@props.chapter.title)
