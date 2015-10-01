{expect} = require 'chai'
_ = require 'underscore'

{CourseListingActions, CourseListingStore} = require '../src/flux/course-listing'
{CurrentUserActions, CurrentUserStore} = require '../src/flux/current-user'

USER_MODEL = require '../api/user.json'
{
  STUDENT_COURSE_ONE_MODEL
  TEACHER_COURSE_TWO_MODEL
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL
  MASTER_COURSES_LIST
} = require './courses-test-data'

STUDENT_MENU = [
  {
    name: 'viewStudentDashboard'
    params: {courseId: '1'}
    label: 'Dashboard'
  }
  {
    name: 'viewGuide'
    params: {courseId: '1'}
    label: 'Performance Forecast'
  }
]

TEACHER_MENU = [
  {
    name: 'taskplans'
    label: 'Dashboard'
    params: {courseId: '2'}
  }
  {
    name: 'viewTeacherGuide'
    params: {courseId: '2'}
    label: 'Performance Forecast'
  }
  {
    name: 'viewScores'
    label: 'Student Scores'
    params: {courseId: '2'}
  }
  {
    name: 'courseSettings'
    label: 'Course Roster'
    params: {courseId: '2'}
  }
]

describe 'Current User Store', ->
  beforeEach ->
    # TODO investigate why .load isn't working yet.
    CurrentUserActions.loaded(USER_MODEL)
    CourseListingActions.loaded(MASTER_COURSES_LIST)

  afterEach ->
    CurrentUserActions.reset()
    CourseListingActions.reset()

  it 'should load name', ->
    expect(CurrentUserStore.getName()).to.equal(USER_MODEL.name)

  it 'should load profile url', ->
    expect(CurrentUserStore.getProfileUrl()).to.equal(USER_MODEL.profile_url)

  it 'should clear the store on reset', ->
    CurrentUserActions.reset()
    expect(CurrentUserStore.getName()).to.equal('Guest')
    expect(CurrentUserStore.getProfileUrl()).to.be.null
    expect(CurrentUserStore.getToken()).to.be.null

  it 'should return expected roles for courses', ->
    expect(CurrentUserStore.getCourseRole(1)).to.equal('student')
    expect(CurrentUserStore.getCourseRole(2)).to.equal('teacher')
    expect(CurrentUserStore.getCourseRole(3)).to.equal('teacher')

  it 'should return expected dashboard routes for courses', ->
    expect(CurrentUserStore.getDashboardRoute(1)).to.equal('viewStudentDashboard')
    expect(CurrentUserStore.getDashboardRoute(2)).to.equal('taskplans')
    expect(CurrentUserStore.getDashboardRoute(3)).to.equal('taskplans')

  it 'should return expected menu routes for courses', ->
    expect(CurrentUserStore.getCourseMenuRoutes('1')).to.deep.equal(STUDENT_MENU)
    expect(CurrentUserStore.getCourseMenuRoutes('2')).to.deep.equal(TEACHER_MENU)

  it 'should return expected guest for non-attending course', ->
    expect(CurrentUserStore.getCourseRole(4)).to.equal('guest')
    expect(CurrentUserStore.getCourseRole(undefined)).to.equal('guest')
