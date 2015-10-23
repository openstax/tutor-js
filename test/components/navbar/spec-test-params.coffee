{TeacherTaskPlanActions, TeacherTaskPlanStore} = require '../../../src/flux/teacher-task-plan'
{StudentDashboardActions, StudentDashboardStore} = require '../../../src/flux/student-dashboard'
{CourseActions, CourseStore} = require '../../../src/flux/course'
{CurrentUserActions, CurrentUserStore} = require '../../../src/flux/current-user'
{CourseListingActions, CourseListingStore} = require '../../../src/flux/course-listing'

STUDENT_DASHBOARD_MODEL = require '../../../api/courses/1/dashboard.json'
TEACHER_DASHBOARD_MODEL = STUDENT_DASHBOARD_MODEL

STUDENT_DASHROUTE = 'viewStudentDashboard'
TEACHER_DASHROUTE = 'taskplans'

STUDENT_MENU = [
  {
    name: STUDENT_DASHROUTE
    params: {courseId: '1'}
    label: 'Dashboard'
  }
  {
    name: 'viewPerformanceForecast'
    params: {courseId: '1'}
    label: 'Performance Forecast'
  }
]

TEACHER_MENU = [
  {
    name: TEACHER_DASHROUTE
    label: 'Dashboard'
  }
  {
    name: 'viewTeacherPerformanceForecast'
    params: {courseId: '1'}
    label: 'Performance Forecast'
  }
  {
    name: 'viewScores'
    label: 'Student Scores'
  }
  {
    name: 'courseSettings'
    label: 'Course Roster'
  }
]

COURSES_LIST = require '../../../api/user/courses.json'
# COURSE_NAME = COURSES_LIST[0].name
COURSE_ID = COURSES_LIST[0].id
USER_MODEL = require '../../../api/user.json'

testParams = {
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

}

setupStores = (roleType) ->
  roleTestParams = testParams[roleType]
  roleTestParams.user = USER_MODEL

  coursesList = _.clone(COURSES_LIST)
  coursesList[0].roles[0].type = roleType

  CurrentUserActions.loaded(roleTestParams.user)
  CourseListingActions.loaded(coursesList)
  roleTestParams.actions.loaded(roleTestParams.dashboard, COURSE_ID)
  roleTestParams

resetStores = (roleType) ->
  CurrentUserActions.reset()
  CourseActions.reset()
  testParams[roleType].actions.reset()

module.exports = { testParams, setupStores, resetStores, userModel: USER_MODEL, courseModel: COURSES_LIST[0] }
