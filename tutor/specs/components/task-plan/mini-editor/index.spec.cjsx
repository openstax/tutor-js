{React, _, sinon, shallow} = require '../../helpers/component-testing'

MiniEditor = require '../../../../src/components/task-plan/mini-editor'

COURSE  = require '../../../../api/courses/1.json'
COURSE_ID = '1'

DATA   = require '../../../../api/courses/1/dashboard'
PLAN = _.findWhere(DATA.plans, id: '7')

describe 'TaskPlan MiniEditor', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    TaskPlanActions.loaded(PLAN, PLAN.id)
    @props =
      courseId: COURSE_ID
      planId:   PLAN.id
      findPopOverTarget: sinon.spy()

  it 'renders with links', ->
    wrapper = shallow(<MiniEditor {...@props} />)
