{Testing, expect, sinon, _} = require '../helpers/component-testing'

BTB = require '../../../src/components/buttons/browse-the-book'
COURSE_ID = '1'
COURSE = require '../../../api/user/courses/1.json'

{CourseActions} = require '../../../src/flux/course'

describe 'Browse the book button', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    @props = {
      courseId: COURSE_ID
      section: [1.2]
      onClick: sinon.spy()
    }

  it 'sets the target url', ->
    Testing.renderComponent( BTB, props: @props ).then ({dom}) ->
      expect(Testing.router.makeHref).to.have.been.calledWith(
        'viewReferenceBookSection', { courseId: COURSE_ID, cnxId: undefined, section: [1.2] }
      )

  it 'can render with or without styles', ->
    Testing.renderComponent( BTB, props: @props ).then ({dom}) ->
      expect(dom.tagName).to.equal('BUTTON')
      expect(_.toArray(dom.classList)).to.deep.equal(['view-reference-guide'])

    @props.unstyled = true
    Testing.renderComponent( BTB, props: @props ).then ({dom}) ->
      expect(dom.tagName).to.equal('A')

  it 'has a link that opens in a new tab', ->
    Testing.renderComponent( BTB, props: @props ).then ({dom}) ->
      expect(dom.getAttribute('target')).to.equal('_blank')

  it 'can link to a page', ->
    @props.page = '123@2'
    Testing.renderComponent( BTB, props: @props ).then ({dom}) =>
      expect(Testing.router.makeHref).to.have.been.calledWith(
        'viewReferenceBookPage', { courseId: COURSE_ID, cnxId: @props.page, section: [1.2] }
      )

  it 'reads the courseId from router', ->
    @props.courseId = null
    Testing.renderComponent( BTB, props: @props, routerParams: {courseId: COURSE_ID}).then ({dom}) ->
      expect(dom).not.to.be.null

  it 'does not render when the courseId is missing', ->
    @props.courseId = null
    Testing.renderComponent( BTB, props: @props, routerParams: {courseId: undefined}).then ({dom}) ->
      expect(dom).to.be.null

  it 'does not render when the courseId is for a concept coach course', ->
    COURSE.is_concept_coach = true
    CourseActions.loaded(COURSE, COURSE_ID)
    Testing.renderComponent( BTB, props: @props, routerParams: {courseId: COURSE_ID}).then ({dom}) ->
      delete COURSE.is_concept_coach
      expect(dom).to.be.null

  it 'passes down props like onClick', ->
    Testing.renderComponent( BTB, props: @props ).then ({element}) ->
      Testing.actions.click(element.getDOMNode())
      expect(element.props.onClick).to.have.been.called

  it 'should append ecosystemId query string if props specify non-default ecosystemId', ->
    @props.ecosystemId = '3'
    Testing.renderComponent( BTB, props: @props ).then ({dom}) ->
      expect(Testing.router.makeHref).to.have.been.calledWith(
        'viewReferenceBookSection', { courseId: COURSE_ID, cnxId: undefined, section: [1.2] }, {ecosystemId: '3'}
      )

  it 'should ignore ecosystemId query string if props specify default ecosystemId', ->
    @props.ecosystemId = '1'
    Testing.renderComponent( BTB, props: @props ).then ({dom}) ->
      expect(Testing.router.makeHref).to.have.been.calledWith(
        'viewReferenceBookSection', { courseId: COURSE_ID, cnxId: undefined, section: [1.2] }
      )
