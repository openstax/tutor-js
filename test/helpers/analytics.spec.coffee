{routerStub}   = require '../components/helpers/utilities'
Analytics = require '../../src/helpers/analytics'

{StudentDashboardStore, StudentDashboardActions} = require '../../src/flux/student-dashboard'
{CourseActions, CourseStore} = require '../../src/flux/course'

COURSE = require '../../api/user/courses/1.json'
COURSE_ID = '1'
DATA = require '../../api/courses/1/dashboard.json'

describe 'Analytics', ->

  beforeEach (done) ->
    @ga = sinon.spy()
    StudentDashboardActions.reset()
    CourseActions.loaded(COURSE, COURSE_ID)
    StudentDashboardActions.HACK_DO_NOT_RELOAD(true)
    StudentDashboardActions.loaded(DATA, COURSE_ID)
    Analytics.setTracker(@ga)
    routerStub.goTo("/courses/1/list").then -> done()

  afterEach ->
    StudentDashboardActions.HACK_DO_NOT_RELOAD(false)

  it 'sets page view with events', ->
    expect(@ga).to.have.been.calledWith('set', 'page', '/student/dashboard/1')
    expect(@ga).to.have.been.calledWith('send', 'event', 'Student', 'Dashboard', '1', undefined)
    expect(@ga).to.have.been.calledWith('send', 'pageview')
