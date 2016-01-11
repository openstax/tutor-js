_ = require 'underscore'

{CCDashboardStore, CCDashboardActions} = require '../../../src/flux/cc-dashboard'
{CourseStore, CourseActions} = require '../../../src/flux/course'
{Testing} = require '../helpers/component-testing'

DashboardShell = require '../../../src/components/cc-dashboard'
BaseModel = require '../../../api/courses/1/cc/dashboard.json'
ExtendBaseStore = (props) -> _.extend({}, BaseModel, props)

BlankCourse = ExtendBaseStore(course: periods: [])

IDS =
  BLANK: '0'
  BASE: '1'

RenderHelper = (courseId) ->
  optionsWithParams =
    routerParams:
      courseId: courseId
  Testing.renderComponent(DashboardShell, optionsWithParams)

describe 'Concept Coach Dashboard Shell', ->
  beforeEach ->
    CourseObj = _.extend {}, _.pick(BlankCourse.course, 'name', 'teachers'), {is_concept_coach: true}

    CCDashboardActions.loaded(BlankCourse, IDS.BLANK)
    CCDashboardActions.loaded(BaseModel, IDS.BASE)
    CourseActions.loaded(CourseObj, IDS.BLANK)
    CourseActions.loaded(CourseObj, IDS.BASE)
    
  it 'loads a blank course when there are no periods', ->
    RenderHelper(IDS.BLANK).then ({dom}) ->
      expect(dom.querySelector('.blank-course')).to.not.be.null

  it 'loads a course dashboard when there are periods', ->
    RenderHelper(IDS.BASE).then ({dom}) ->
      expect(dom.querySelector('.dashboard')).to.not.be.null


