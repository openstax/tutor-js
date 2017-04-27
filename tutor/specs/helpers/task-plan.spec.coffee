_ = require 'underscore'

jest.mock('../../src/flux/task-plan')
TaskPlanFlux = require '../../src/flux/task-plan'

{ default: TaskPlan } = require '../../src/helpers/task-plan'
{CourseListingActions} = require '../../src/flux/course-listing'

COURSE_ID = 1
COURSE = require '../../api/courses/1'
DATA   = require '../../api/courses/1/dashboard'

SINGLE = _.findWhere(DATA.plans, id: '7')
SAME   = _.findWhere(DATA.plans, id: '8')
DIFFER = _.findWhere(DATA.plans, id: '9')

describe 'task-plan helper', ->

  beforeEach ->
    CourseListingActions.load(COURSE, COURSE_ID)

  it 'returns a single due date for single task plan', ->
    dates = TaskPlan.dates(SINGLE)
    expect( dates ).to.deep.equal(
      all:
        opens_at: '2015-03-31T11:40:23.796Z'
        due_at:   '2015-04-05T10:00:00.000Z'
    )
    undefined

  it 'returns a single due date when all dates are identical', ->
    dates = TaskPlan.dates(SAME)
    expect( dates ).to.deep.equal(
      all:
        opens_at: '2015-02-31T11:40:23.796Z'
        due_at:   '2015-04-05T10:00:00.000Z'
    )
    undefined

  it 'returns the period id with dates when not the same', ->
    dates = TaskPlan.dates(DIFFER)
    expect( dates ).to.deep.equal(
      1:
        opens_at: '2015-01-31T11:40:23.796Z'
        due_at:   '2015-04-05T10:00:00.000Z'
      2:
        opens_at: '2015-03-30T11:40:23.796Z'
        due_at:   '2015-04-05T10:00:00.000Z'
    )
    undefined

  it 'will check and return only a given attr', ->
    dates = TaskPlan.dates(DIFFER, only: 'due_at')
    expect( dates ).to.deep.equal(
      all:
        due_at: '2015-04-05T10:00:00.000Z'
    )
    undefined


  it 'calculates api options depending on plan isNew', ->
    expect(TaskPlan.apiEndpointOptions(SINGLE.id, COURSE_ID))
      .to.deep.equal(url: "plans/#{SINGLE.id}")

    TaskPlanFlux.TaskPlanStore.isNew.mockReturnValue(true)
    expect(TaskPlan.apiEndpointOptions(SINGLE.id, COURSE_ID))
      .to.deep.equal(url: "courses/#{COURSE_ID}/plans", method: 'POST')

    TaskPlanFlux.TaskPlanStore.get.mockReturnValue(ecosystem_id: 42)
    expect(TaskPlan.apiEndpointOptions(SINGLE.id, COURSE_ID))
      .to.deep.equal(
        url: "courses/#{COURSE_ID}/plans", method: 'POST', params: {ecosystem_id:42}
      )

    undefined
