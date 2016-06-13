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

  it 'displays the help page when there are no periods', ->
    RenderHelper(IDS.BLANK).then ({dom}) ->
      expect(dom).to.exist
      expect(dom.classList.contains('cc-dashboard-help-page')).to.be.true

  it 'renders dashboard when there are periods', (done) ->
    RenderHelper(IDS.BASE).then ({dom}) ->
      expect(dom.classList.contains('dashboard')).to.be.true
      done()
