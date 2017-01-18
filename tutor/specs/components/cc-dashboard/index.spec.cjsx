React = require 'react'

jest.mock('../../../src/helpers/router')
Router = require '../../../src/helpers/router'
SnapShot = require 'react-test-renderer'
_ = require 'underscore'
Context = require '../helpers/enzyme-context'

{CCDashboardStore, CCDashboardActions} = require '../../../src/flux/cc-dashboard'
{CourseStore, CourseActions} = require '../../../src/flux/course'
{Testing} = require '../helpers/component-testing'

DashboardShell = require '../../../src/components/cc-dashboard'
BaseModel = require '../../../api/courses/1/cc/dashboard.json'
ExtendBaseStore = (props) -> _.extend({}, BaseModel, props)

BlankCourse = ExtendBaseStore(course:{ periods: [], name: "Blank!"})

IDS =
  BLANK: '0'
  BASE: '1'

RenderHelper = (courseId) ->
  optionsWithParams =
    routerParams:
      courseId: courseId
  Testing.renderComponent(DashboardShell, optionsWithParams)

describe 'Concept Coach Dashboard Shell', ->
  beforeEach (done) ->
    Router.currentQuery.mockReturnValue({})
    CourseObj = _.extend {}, _.pick(BlankCourse.course, 'name', 'teachers'), {is_concept_coach: true}
    CCDashboardActions.loaded(BlankCourse, IDS.BLANK)
    CCDashboardActions.loaded(BaseModel, IDS.BASE)
    CourseActions.loaded(CourseObj, IDS.BLANK)
    CourseActions.loaded(CourseObj, IDS.BASE)
    _.defer(done)

  it 'displays the help page when there are no periods', ->
    Router.currentParams.mockReturnValue({courseId: IDS.BLANK})
    wrapper = mount(<DashboardShell />, Context.build())
    expect(wrapper).toHaveRendered('.cc-dashboard-help')

  it 'renders dashboard when there are periods', ->
    Router.currentParams.mockReturnValue({courseId: IDS.BASE})
    wrapper = mount(<DashboardShell />, Context.build())
    expect(wrapper).toHaveRendered('.cc-dashboard')
    expect(wrapper).not.toHaveRendered('.cc-dashboard-help')
