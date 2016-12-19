Analytics = require '../../src/helpers/analytics'

{CourseActions} = require '../../src/flux/course'

COURSE = require '../../api/user/courses/1.json'
COURSE_ID = '1'

describe 'Analytics', ->

  beforeEach ->
    @ga = sinon.spy()
    Analytics.setTracker(@ga)
    CourseActions.loaded(COURSE, COURSE_ID)
    @sendPageView = sinon.spy(Analytics, 'sendPageView')

  afterEach ->
    Analytics.sendPageView.restore()

  it 'sets page view with unknown route events', ->
    Analytics.onNavigation("/bad/courses/1/list")
    expect(Analytics.sendPageView).to.have.been.calledWith('/not-found/bad/courses/1/list')
    undefined

  it 'skips sending pageviews if ga isn\'t present', ->
    Analytics.setTracker(undefined)
    Analytics.onNavigation("/course/1")
    expect(Analytics.sendPageView).not.to.have.been.called
    undefined

  it 'translates known urls when sending', ->
    c = '/course/1'
    tests = {
      "#{c}":                             '/student/dashboard/1'
      "#{c}/practice" :                   '/student/practice/1'
      "#{c}/guide" :                      '/student/performance-forecast/1'
      "#{c}/t/month/2011-11-11":          '/teacher/calendar/1'
      "#{c}/scores":                      '/teacher/student-scores/1'
      "#{c}/settings":                    '/teacher/roster/1'
      "#{c}/reading/11":                  '/teacher/assignment/edit/reading/1'
      "#{c}/homework/11":                 '/teacher/assignment/edit/homework/1'
      "#{c}/external/11":                 '/teacher/assignment/edit/external/1'
      "#{c}/reading/new":                 '/teacher/assignment/create/reading/1'
      "#{c}/homework/new":                '/teacher/assignment/create/homework/1'
      "#{c}/external/new":                '/teacher/assignment/create/external/1'
      "#{c}/t/month/2011-11-11/plan/66":  '/teacher/metrics/quick/1'
      "/books/12":                        '/reference-view/12'
      "/books/12/section/2":              '/reference-view/12/section/2'
      "/books/12/page/22222-333":         '/reference-view/12/page/22222-333'
    }
    for route, translated of tests
      Analytics.onNavigation(route)
      expect(Analytics.sendPageView).to.have.been.calledWith(translated)

    undefined
