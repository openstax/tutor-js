COURSE_SETTINGS = 'Course Settings'
COURSES = 'Courses'
DASHBOARD = 'Dashboard'
EXTERNAL_BUILDER = 'External Assignment'
HOMEWORK_BUILDER = 'Homework Builder'
LEARNING_GUIDE = 'Performance Forecast'
PERFORMANCE_REPORT = 'Performance Report'
PLAN_REVIEW = 'Plan Review'
PLAN_STATS = 'Plan Stats'
PRACTICE = 'Practice'
READING_BUILDER = 'Reading Builder'
STEP = 'Step'
TASK = 'Task'

routesAndDestinations =
  dashboard: COURSES
  viewStudentDashboard: DASHBOARD
  viewTask: TASK
  viewTaskStep: STEP
  viewPractice: PRACTICE
  viewGuide: LEARNING_GUIDE
  viewTeacherDashboard: DASHBOARD
  viewPerformance: PERFORMANCE_REPORT
  viewTeacherGuide: LEARNING_GUIDE
  viewStudentTeacherGuide: LEARNING_GUIDE
  taskplans: DASHBOARD
  calendarByDate: DASHBOARD
  calendarViewPlanStats: DASHBOARD
  createHomework: HOMEWORK_BUILDER
  editHomework: HOMEWORK_BUILDER
  createReading: READING_BUILDER
  editReading: READING_BUILDER
  createExternal: EXTERNAL_BUILDER
  editExternal: EXTERNAL_BUILDER
  courseSettings: COURSE_SETTINGS
  viewStats: PLAN_STATS
  reviewTask: PLAN_REVIEW
  reviewTaskPeriod: PLAN_REVIEW
  reviewTaskStep: PLAN_REVIEW

destinationHelpers =
  getDestination: (routeName) ->
    routesAndDestinations[routeName]

module.exports = destinationHelpers
