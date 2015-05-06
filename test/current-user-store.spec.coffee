{expect} = require 'chai'
_ = require 'underscore'

{CurrentUserActions, CurrentUserStore} = require '../src/flux/current-user'

USER_MODEL = require '../api/user.json'

STUDENT_COURSE_ONE_MODELS = require '../api/courses.json'

STUDENT_COURSE_ONE_MODEL = STUDENT_COURSE_ONE_MODELS[0]
TEACHER_COURSE_TWO_MODEL = {
  id: 2
  name: 'Local Test Course Two'
  roles: [
    {
      "type": "teacher"
    }
  ]
}

TEACHER_AND_STUDENT_COURSE_THREE_MODEL = {
  id: 3
  name:'Local Test Course Three'
  roles: [
    {
      type: 'student'
    }
    {
      type: 'teacher'
    }
  ]
}

MASTER_COURSES_LIST = [
  STUDENT_COURSE_ONE_MODEL
  TEACHER_COURSE_TWO_MODEL
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL
]

STUDENT_MENU = [
  {
    name: 'viewStudentDashboard'
    label: 'Dashboard'
  }
  {
    name: 'viewGuide'
    label: 'Learning Guide'
  }
]

TEACHER_MENU = [
  {
    name: 'taskplans'
    label: 'Dashboard'
  }
]

describe 'Current User Store', ->
  beforeEach ->
    # TODO investigate why .load isn't working yet.
    CurrentUserActions.loadedName(USER_MODEL)
    CurrentUserActions.loadedAllCourses(MASTER_COURSES_LIST)

  afterEach ->
    CurrentUserActions.reset()

  it 'should load name and courses', ->

    expect(CurrentUserStore.getName()).to.equal(USER_MODEL.name)
    expect(CurrentUserStore.isCoursesLoaded()).to.be.true

    # check on names only in case course store gets updated independently.
    storeCourseNames = _.pluck(CurrentUserStore.getCourses(), 'name')

    expect(storeCourseNames).to.deep.equal(_.pluck(MASTER_COURSES_LIST, 'name'))

  it 'should clear the store on reset', ->
    CurrentUserActions.reset()

    expect(CurrentUserStore.getName()).to.equal('Guest')
    expect(CurrentUserStore.isCoursesLoaded()).to.be.false
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

    expect(CurrentUserStore.getMenuRoutes(1)).to.deep.equal(STUDENT_MENU)
    expect(CurrentUserStore.getMenuRoutes(2)).to.deep.equal(TEACHER_MENU)
    expect(CurrentUserStore.getMenuRoutes(3)).to.deep.equal(TEACHER_MENU)

  it 'should return expected guest for non-attending course', ->

    expect(CurrentUserStore.getCourseRole(4)).to.equal('guest')
    expect(CurrentUserStore.getCourseRole(undefined)).to.equal('guest')
