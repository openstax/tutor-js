jest.mock('react-dom')

ReactDOM = require 'react-dom'

{Testing, sinon, _, SnapShot, React} = require '../../helpers/component-testing'

{TocActions, TocStore} = require '../../../../src/flux/toc'
{TaskPlanActions, TaskPlanStore} = require '../../../../src/flux/task-plan'
{ExtendBasePlan, PlanRenderHelper} = require '../../helpers/task-plan'
{default: Courses} = require '../../../../src/models/courses-map'
{ExerciseActions} = require  '../../../../src/flux/exercise'

FakeDOMNode = require 'shared/specs/helpers/fake-dom-node'

NEW_PLAN = ExtendBasePlan({id: PLAN_ID, type: 'homework', settings: { exercise_ids: ["1616"] } })

EXERCISES = require '../../../../api/exercises'
READINGS  = require '../../../../api/ecosystems/1/readings.json'
COURSE = require '../../../../api/user/courses/1.json'
SECTION_IDS  = [234..242]
ECOSYSTEM_ID = '1'
COURSE_ID    = '1'
PLAN_ID      = '1'

AddExercises = require '../../../../src/components/task-plan/homework/add-exercises'

describe 'choose exercises component', ->

  beforeEach ->
    ReactDOM.findDOMNode = jest.fn(-> new FakeDOMNode)
    @props =
      courseId: COURSE_ID
      planId: PLAN_ID
      onAddClick: sinon.spy()
      sectionIds: SECTION_IDS
    Courses.bootstrap([COURSE], { clear: true })
    ExerciseActions.loadedForCourse(EXERCISES, COURSE_ID, SECTION_IDS)
    TocActions.loaded(READINGS, ECOSYSTEM_ID)
    TaskPlanActions.loaded(NEW_PLAN, PLAN_ID)

  it 'uses ecosystemId from task when loading', ->
    plan = ExtendBasePlan({id: PLAN_ID, ecosystem_id: '42'})
    TaskPlanActions.loaded(plan, PLAN_ID)
    @props.sectionIds = ['99']
    ExerciseActions.loadForCourse = jest.fn()
    exercises = shallow(<AddExercises {...@props} />)
    expect(ExerciseActions.loadForCourse).toHaveBeenCalledWith(COURSE_ID, @props.sectionIds, '42')


  it 'matches snapshot', ->
    expect(SnapShot.create(<AddExercises {...@props} />).toJSON()).toMatchSnapshot()
    undefined
