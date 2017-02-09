jest.mock('../../../src/helpers/router')
Router = require '../../../src/helpers/router'

EnzymeContext = require '../helpers/enzyme-context'

EventRow = require '../../../src/components/student-dashboard/event-row'
{Testing, _, SnapShot, React, Wrapper} = require '../helpers/component-testing'

STATS = require '../../../api/plans/1/stats.json'
REVIEW = require '../../../api/plans/1/review.json'

{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../../src/flux/task-plan-stats'
{TaskTeacherReviewStore, TaskTeacherReviewActions} = require '../../../src/flux/task-teacher-review'

Breadcrumbs = require '../../../src/components/task-teacher-review/breadcrumbs'

describe 'Task Teacher Review: Breadcrumbs', ->
  beforeEach ->
    TaskPlanStatsActions.loaded('1', STATS)
    TaskTeacherReviewActions.loaded('1', REVIEW)
    @props =
      scrollToStep: jest.fn()
      goToStep: jest.fn()
      crumbs: [{
        type: "exercise", sectionLabel: "5.4", key: 5
      }]
      title: 'Title'
      courseId: '1'
      id: '1'

  it 'renders and matches snapshot', ->
    bc = shallow(<Breadcrumbs {...@props} />)
    expect(bc).toHaveRendered('BreadcrumbStatic')
    Router.makePathname.mockReturnValue('/bread')
    expect(SnapShot.create(
      <Wrapper _wrapped_component={Breadcrumbs} noReference {...@props}/>).toJSON()
    ).toMatchSnapshot()
    undefined


  it 'attempts to scroll when click', ->
    Router.makePathname.mockReturnValue('/bread')
    bc = mount(<Breadcrumbs {...@props} />, EnzymeContext.build())
    bc.find('Breadcrumb').simulate('click')
    expect(@props.goToStep).toHaveBeenCalled()
