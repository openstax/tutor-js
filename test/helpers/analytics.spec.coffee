{routerStub}   = require '../components/helpers/utilities'
Analytics = require '../../src/helpers/analytics'

{StudentDashboardStore, StudentDashboardActions} = require '../../src/flux/student-dashboard'
{CourseActions, CourseStore} = require '../../src/flux/course'

COURSE = require '../../api/user/courses/1.json'
COURSE_ID = '1'
DATA = require '../../api/courses/1/dashboard.json'

describe 'Analytics', ->

  beforeEach ->
    @ga = sinon.spy()
    StudentDashboardActions.reset()
    CourseActions.loaded(COURSE, COURSE_ID)
    StudentDashboardActions.HACK_DO_NOT_RELOAD(true)
    StudentDashboardActions.loaded(DATA, COURSE_ID)
    @sendPageView = sinon.spy(Analytics, 'sendPageView')


  afterEach ->
    StudentDashboardActions.HACK_DO_NOT_RELOAD(false)
    Analytics.sendPageView.restore()

  it 'sets page view with events', (done) ->
    Analytics.setTracker(@ga)
    routerStub.goTo("/courses/1/list").then =>
      expect(@ga).to.have.been.calledWith('set', 'page', '/student/dashboard/1')
      expect(@ga).to.have.been.calledWith('send', 'event', 'Student', 'Dashboard', '1', undefined)
      expect(@ga).to.have.been.calledWith('send', 'pageview')
      done()

  it 'skips sending pageviews if ga isn\'t present', ->
    Analytics.setTracker(undefined)
    routerStub.goTo("/courses/1/list").then =>
      expect(@ga).not.to.have.been.called
      expect(@sendPageView).not.to.have.been.called
