_ = require 'underscore'
moment = require 'moment'
cloneDeep = require 'lodash/cloneDeep'

{TaskPlanActions, TaskPlanStore} = require '../../src/flux/task-plan'
{ default: Courses } = require '../../src/models/courses-map'

COURSE  = require '../../api/courses/1.json'
COURSE_ID = '1'

DATA   = require '../../api/courses/1/dashboard'
PLAN = _.findWhere(DATA.plans, id: '7')
HOMEWORK_WITH_FALSE = _.findWhere(DATA.plans, id: '29')

describe 'TaskPlan Store', ->

  beforeEach ->
    Courses.bootstrap([COURSE], { clear: true })
    TaskPlanActions.loaded(PLAN, PLAN.id)

  it 'can clone a task plan', ->
    newId = '111'
    TaskPlanActions.createClonedPlan( newId, {
      planId: PLAN.id, courseId: COURSE_ID, due_at: moment()
    })
    clone = TaskPlanStore.getChanged(newId)
    for attr in ['title', 'description', 'type', 'settings', 'is_feedback_immediate']
      expect(clone[attr]).to.deep.equal(PLAN[attr])

    expect(clone.cloned_from_id).to.equal(PLAN.id)
    for period in Courses.get(COURSE_ID).periods.active
      tasking_plan = _.find(clone.tasking_plans, target_id: period.id)
      expect(tasking_plan).to.exist

    undefined

  it 'can clone a task plan even when one of the properties is false', ->
    newId = '111'
    TaskPlanActions.loaded(HOMEWORK_WITH_FALSE, HOMEWORK_WITH_FALSE.id)
    TaskPlanActions.createClonedPlan( newId, {
      planId: HOMEWORK_WITH_FALSE.id, courseId: COURSE_ID, due_at: moment()
    })
    clone = TaskPlanStore.getChanged(newId)
    for attr in ['title', 'description', 'type', 'settings', 'is_feedback_immediate']
      expect(clone[attr]).to.deep.equal(HOMEWORK_WITH_FALSE[attr])

    expect(clone.cloned_from_id).to.equal(HOMEWORK_WITH_FALSE.id)
    for period in Courses.get(COURSE_ID).periods.active
      tasking_plan = _.find(clone.tasking_plans, target_id: period.id)
      expect(tasking_plan).to.exist

    undefined
