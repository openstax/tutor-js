{React, SnapShot} = require '../../components/helpers/component-testing'

PLANS  = require '../../../api/courses/1/plans.json'
{PastTaskPlansActions, PastTaskPlansStore} = require '../../../src/flux/past-task-plans'

{PastAssignments} = require '../../../src/screens/teacher-dashboard/past-assignments'
COURSE_ID = '1'

describe 'CourseCalendar Past Assignments listing', ->

  beforeEach ->
    PastTaskPlansActions.loaded(PLANS, COURSE_ID)
    @props =
      courseId: COURSE_ID
      cloningPlanId: ''

  it 'lists plans in due date order', ->
    wrapper = shallow(<PastAssignments {...@props} />)
    expect(PastTaskPlansStore.hasPlans(COURSE_ID)).to.be.true
    dueTimes = wrapper.find('DragSource(CloneAssignmentLink)').map (ds) -> ds.prop('plan').due_at
    expect(dueTimes).to.deep.equal([
      '2015-03-10T04:00:00.000Z',
      '2015-03-01T04:00:00.000Z',
      '2015-03-18T04:00:00.000Z',
      '2015-04-01T04:00:00.000Z',
      '2015-04-05T04:00:00.000Z',
      '2015-10-14T12:00:00.000Z'
    ])
    undefined
