{Testing, sinon, _, React} = require '../../helpers/component-testing'
_ = require 'underscore'
moment = require 'moment-timezone'

{TocActions, TocStore} = require '../../../../src/flux/toc'
{TaskPlanActions, TaskPlanStore} = require '../../../../src/flux/task-plan'
{ExtendBasePlan, PlanRenderHelper} = require '../../helpers/task-plan'
{default: Courses} = require '../../../../src/models/courses-map'

ECOSYSTEM_ID = '1'
COURSE_ID    = '1'
PLAN_ID      = '1'

COURSE = require '../../../../api/user/courses/1.json'
READINGS  = require '../../../../api/ecosystems/1/readings.json'
NEW_PLAN = ExtendBasePlan({id: PLAN_ID})

ChooseExercises = require '../../../../src/components/task-plan/homework/choose-exercises'

describe 'choose exercises component', ->

  beforeEach ->
    TocActions.loaded(READINGS, ECOSYSTEM_ID)
    TaskPlanActions.loaded(NEW_PLAN, PLAN_ID)
    Courses.bootstrap([COURSE], { clear: true })
    @props =
      ecosystemId: ECOSYSTEM_ID
      courseId: COURSE_ID
      canEdit: false
      planId: PLAN_ID
      cancel: sinon.spy()
      hide: sinon.spy()

  it 'renders selections', ->
    Testing.renderComponent( ChooseExercises, props: @props ).then ({dom}) ->
      expect(dom.querySelector('[data-chapter-section="1.1"]')).to.exist

  it 'hides exercises onSectionChange', ->
    Testing.renderComponent( ChooseExercises, props: @props, unmountAfter: 10 ).then ({dom, element}) ->
      Testing.actions.click( dom.querySelector('.section') )
      expect(element.state.showProblems).to.be.false
