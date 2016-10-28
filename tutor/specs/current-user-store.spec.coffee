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
    name: 'dashboard'
    params: {courseId: '1'}
    label: 'Dashboard'
  }
  {
    name: 'viewPerformanceGuide'
    params: {courseId: '1'}
    label: 'Performance Forecast'
  }
  {
    name: 'changeStudentId'
    params: {courseId: '1'}
    label: 'Change Student ID'
  }
  {
    name: 'createNewCourse'
    params: undefined
    label: 'Add New Course'
  }
]

TEACHER_MENU = [
  {
    name: 'dashboard'
    label: 'Dashboard'
    params: {courseId: '2'}
  }
  {
    name: 'viewPerformanceGuide'
    params: {courseId: '2'}
    label: 'Performance Forecast'
  }
  {
    name: 'viewQuestionsLibrary'
    params: {courseId: '2'}
    label: 'Question Library'
  }
  {
    name: 'viewScores'
    label: 'Student Scores'
    params: {courseId: '2'}
  }
  {
    name: 'courseSettings'
    label: 'Course Settings and Roster'
    params: {courseId: '2'}
  }
  {
    name: 'createNewCourse'
    params: { offeringId: 1 }
    label: 'Add New Course'
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
    undefined

  it 'should load profile url', ->
    expect(CurrentUserStore.getProfileUrl()).to.equal(USER_MODEL.profile_url)
    undefined

  it 'should clear the store on reset', ->
    CurrentUserActions.reset()
    expect(CurrentUserStore.getName()).to.equal('Guest')
    expect(CurrentUserStore.getProfileUrl()).to.be.null
    expect(CurrentUserStore.getToken()).to.be.null
    undefined

  it 'should return expected roles for courses', ->
    expect(CurrentUserStore.getCourseRole(1)).to.equal('student')
    expect(CurrentUserStore.getCourseRole(2)).to.equal('teacher')
    expect(CurrentUserStore.getCourseRole(3)).to.equal('teacher')
    undefined

  it 'should return expected dashboard routes for courses', ->
    expect(CurrentUserStore.getDashboardRoute(1)).to.equal('dashboard')
    expect(CurrentUserStore.getDashboardRoute(2)).to.equal('dashboard')
    expect(CurrentUserStore.getDashboardRoute(3)).to.equal('dashboard')
    undefined

  it 'should return expected menu routes for courses', ->
    expect(CurrentUserStore.getCourseMenuRoutes('1')).to.deep.equal(STUDENT_MENU)
    expect(CurrentUserStore.getCourseMenuRoutes('2')).to.deep.equal(TEACHER_MENU)
    undefined
