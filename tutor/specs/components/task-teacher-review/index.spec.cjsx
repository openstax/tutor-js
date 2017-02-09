EventRow = require '../../../src/components/student-dashboard/event-row'
{Testing, _, SnapShot, React} = require '../helpers/component-testing'

STATS = require '../../../api/plans/1/stats.json'
REVIEW = require '../../../api/plans/1/review.json'

{TaskPlanStatsStore, TaskPlanStatsActions} = require '../../../src/flux/task-plan-stats'
{TaskTeacherReviewStore, TaskTeacherReviewActions} = require '../../../src/flux/task-teacher-review'

{TaskTeacherReview} = require '../../../src/components/task-teacher-review'

describe 'Task Teacher Review', ->
  beforeEach ->
    TaskPlanStatsActions.loaded('1', STATS)
    TaskTeacherReviewActions.loaded('1', REVIEW)
    @props =
      courseId: '1'
      id: '1'

  it 'renders and matches snapshot', ->
    review = shallow(<TaskTeacherReview {...@props} />)
    expect(review).toHaveRendered('ReviewShell[id="1"]')
    expect(review).toHaveRendered('StatsModalShell[id="1"]')
    expect(SnapShot.create(
      <TaskTeacherReview {...@props} />
    ).toJSON() ).toMatchSnapshot()
    undefined
