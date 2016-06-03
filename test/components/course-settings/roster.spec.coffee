{Testing, expect, sinon, _, ReactTestUtils} = require '../helpers/component-testing'

Roster = require '../../../src/components/course-settings/roster'

COURSE = require '../../../api/user/courses/1.json'
ROSTER = require '../../../api/courses/1/roster.json'

COURSE_ID = '1'

{CourseActions} = require '../../../src/flux/course'
{PeriodActions} = require '../../../src/flux/period'
{RosterActions} = require '../../../src/flux/roster'

describe 'Course Settings', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    RosterActions.loaded(ROSTER, COURSE_ID)
    sinon.stub(PeriodActions, 'delete').returns(null)
    @props =
      courseId: COURSE_ID

  afterEach ->
    PeriodActions.delete.restore()

  # it 'displays students in roster', ->
  #   Testing.renderComponent( Roster, props: @props ).then ({dom}) ->n
  #     expect(dom.tagName).to.equal('I')
  it 'renders period panels', ->
    Testing.renderComponent( Roster, props: @props ).then ({dom}) ->
      titles = _.pluck(dom.querySelectorAll('.nav-tabs li a'), 'textContent')
      expect(titles)
        .to.deep.equal(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '10th'])


  it 'renders students in the panels', ->
    Testing.renderComponent( Roster, props: @props ).then ({dom}) ->
      names = _.pluck(dom.querySelectorAll("table.roster tr td:nth-child(2)"), 'textContent')
      expect(names).to.deep.equal(
        ['Angstrom', 'Glass', 'Hackett', 'Jaskolski', 'Lowe', 'Tromp', 'Reilly']
      )


  it 'switches roster when tab is clicked', (done) ->
    Testing.renderComponent( Roster, props: @props ).then ({dom, element}) ->
      Testing.actions.click(dom.querySelector('.periods .nav-tabs li:nth-child(2) a'))
      _.defer ->
        names = _.pluck(element.getDOMNode().querySelectorAll("table.roster tr td:nth-child(2)"), 'textContent')
        expect(names).to.deep.equal(
          ['Bloom', 'Kirlin']
        )
        done()

  it 'can archive periods', (done) ->
    Testing.renderComponent( Roster, props: @props ).then ({dom}) ->
      Testing.actions.click(dom.querySelector('.control.archive-period'))
      _.defer ->
        Testing.actions.click(document.querySelector('button.archive-section'))
        expect(PeriodActions.delete).to.have.been.called
        done()
