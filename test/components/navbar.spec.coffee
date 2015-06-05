{expect} = require 'chai'
_ = require 'underscore'

{Promise} = require 'es6-promise'
React = require 'react/addons'

{routerStub}   = require './helpers/utilities'
Navbar = require '../../src/components/navbar'

{CurrentUserActions, CurrentUserStore} = require '../../src/flux/current-user'
{CourseActions, CourseStore} = require '../../src/flux/course'
{TeacherTaskPlanActions, TeacherTaskPlanStore} = require '../../src/flux/teacher-task-plan'
{StudentDashboardActions, StudentDashboardStore} = require '../../src/flux/student-dashboard'
{CourseListingActions, CourseListingStore} = require '../../src/flux/course-listing'

USER_MODEL = require '../../api/user.json'

COURSES_LIST = require '../../api/courses.json'

COURSE_NAME = COURSES_LIST[0].name
COURSE_ID = COURSES_LIST[0].id

STUDENT_DASHBOARD_MODEL = require '../../api/courses/1/dashboard.json'
TEACHER_DASHBOARD_MODEL = STUDENT_DASHBOARD_MODEL

STUDENT_DASHROUTE = 'viewStudentDashboard'
TEACHER_DASHROUTE = 'taskplans'

STUDENT_MENU = [
  {
    name: STUDENT_DASHROUTE
    label: 'Dashboard'
  }
  {
    name: 'viewGuide'
    label: 'Learning Guide'
  }
]

TEACHER_MENU = [
  {
    name: TEACHER_DASHROUTE
    label: 'Dashboard'
  }
  {
    name: 'viewPerformance'
    label: 'Performance Book'
  }
]

testParams =
  student:
    dashboard: STUDENT_DASHBOARD_MODEL
    dashroute: STUDENT_DASHROUTE
    menu: STUDENT_MENU
    actions: StudentDashboardActions
    dashpath: '/courses/1/list/'

  teacher:
    dashboard: TEACHER_DASHBOARD_MODEL
    dashroute: TEACHER_DASHROUTE
    menu: TEACHER_MENU
    actions: TeacherTaskPlanActions
    dashpath: '/courses/1/t/calendar/'

testWithRole = (roleType) ->

  roleTestParams = testParams[roleType]
  roleTestParams.user = USER_MODEL

  ->
    # Don't need to render on each since no actions are being performed between each task
    before (done) ->
      container = document.createElement('div')
      coursesList = _.clone(COURSES_LIST)
      coursesList[0].roles[0].type = roleType

      CurrentUserActions.loadedName(roleTestParams.user)
      CourseListingActions.loaded(coursesList)
      roleTestParams.actions.loaded(roleTestParams.dashboard, COURSE_ID)

      routerStub
        .goTo('/dashboard')
        .then((result) =>

          navbarComponent = React.addons.TestUtils.findRenderedComponentWithType(result.component, Navbar)
          navbarDOMNode = navbarComponent.getDOMNode()

          @result = _.extend({navbarComponent, navbarDOMNode}, result)

          done()
        , done)

    after ->
      routerStub.unmount()

      CurrentUserActions.reset()
      CourseActions.reset()
      roleTestParams.actions.reset()


    it 'should have redirected from dashboard to a role-based dashboard path', (done) ->
      {router} = @result

      currentPath = router.getCurrentPath()
      expectedPath = router.makeHref(roleTestParams.dashroute, {courseId: COURSE_ID})

      expect(currentPath).to.equal(expectedPath)
      done()

    it 'should have a navbar', (done) ->
      {navbarComponent} = @result

      expect(React.addons.TestUtils.isCompositeComponent(navbarComponent)).to.be.true
      done()

    it 'should have expected course name', (done) ->
      {navbarDOMNode} = @result

      expect(navbarDOMNode.innerText).to.include(COURSE_NAME)
      done()

    it 'should have expected user name', (done) ->
      {navbarDOMNode} = @result

      expect(navbarDOMNode.innerText).to.include(USER_MODEL.name)
      done()

    it 'should have expected dropdown menu', (done) ->
      {navbarComponent} = @result
      navDropDown = navbarComponent.refs.navDropDown.getDOMNode()
      dropdownItems = navDropDown.querySelectorAll('li')

      roleItems = Array.prototype.slice.call(dropdownItems, 0, -2)

      roleLabels = _.map roleItems, (item) ->
        item.innerText

      expect(roleLabels).to.deep.equal(_.pluck(roleTestParams.menu, 'label'))

      done()

describe 'Student Navbar Component', testWithRole('student')

describe 'Teacher Navbar Component', testWithRole('teacher')
