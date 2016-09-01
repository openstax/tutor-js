{Testing, expect, sinon, _, ReactTestUtils} = require '../helpers/component-testing'
ld = require 'lodash'

ChangePeriod = require '../../../src/components/course-settings/change-period'

COURSE = require '../../../api/user/courses/1.json'
ROSTER = require '../../../api/courses/1/roster.json'

COURSE_ID = '1'

{CourseActions} = require '../../../src/flux/course'
{PeriodActions} = require '../../../src/flux/period'
{RosterActions} = require '../../../src/flux/roster'

describe 'Course Settings, change period', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    RosterActions.loaded(ROSTER, COURSE_ID)
    sinon.stub(RosterActions, 'save').returns(null)

    @props =
      student: ROSTER.students[4] # Good 'ole Rabbit
      courseId: COURSE_ID

  afterEach ->
    RosterActions.save.restore()

  it 'does not render if only one period is available', ->
    course = ld.cloneDeep(COURSE)
    course.periods = [ course.periods[0] ]
    CourseActions.loaded(course, COURSE_ID)
    Testing.renderComponent( ChangePeriod, props: @props ).then ({dom}) ->
      expect(dom).not.to.exist

  it 'does not list archived periods as an option', (done) ->
    Testing.renderComponent( ChangePeriod, props: @props ).then ({dom}) ->
      Testing.actions.click(dom)
      _.defer ->
        periods = _.pluck(document.querySelectorAll('.change-period li'), 'textContent')
        expect( periods ).not.to.contain('1st')
        expect( periods ).not.to.contain('4th')
        expect( periods ).not.to.contain('7th')
        done()
