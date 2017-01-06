{React, SnapShot} = require '../helpers/component-testing'

SelectTopics = require '../../../src/components/task-plan/select-topics'

{CourseActions, CourseStore} = require '../../../src/flux/course'
{TaskPlanActions, TaskPlanStore} = require '../../../src/flux/task-plan'
{TocStore, TocActions} = require '../../../src/flux/toc'

{ExtendBasePlan, PlanRenderHelper} = require '../helpers/task-plan'
{HomeworkPlan} = require '../../../src/components/task-plan/homework'

COURSE_ID = '1'
ECOSYSTEM_ID = '3'
COURSE = require '../../../api/user/courses/1.json'
HOMEWORK = require '../../../api/plans/2.json'
READINGS  = require '../../../api/ecosystems/3/readings.json'

helper = (model) -> PlanRenderHelper(model, HomeworkPlan)

describe 'Select Topics', ->

  beforeEach ->
    TocActions.reset()
    TaskPlanActions.reset()
    CourseActions.loaded(COURSE, COURSE_ID)
    TocActions.loaded(READINGS, ECOSYSTEM_ID)
    TaskPlanActions.loaded(HOMEWORK, HOMEWORK.id)
    @props =
      ecosystemId: HOMEWORK.ecosystem_id
      planId: HOMEWORK.id
      courseId: COURSE_ID
      onSectionChange: jest.fn()
      hide: jest.fn()
      selected: []
      header: 'Section Chooser Header'
      cancel: jest.fn()

  it 'renders using ecosystem of task', ->
    wrapper = mount(<SelectTopics {...@props} />)
    expect(wrapper.find(".select-chapters[data-ecosystem-id=\"#{@props.ecosystemId}\"]")).to.have.length(1)
    undefined

  it 'matches snapshot', ->
    expect(SnapShot.create(<SelectTopics {...@props} />).toJSON()).toMatchSnapshot()
    undefined
