React = require 'react'
Router = require 'react-router'
{Route, Redirect, NotFoundRoute} = Router
{App, Root, Dashboard, SingleTask, SinglePractice, Invalid} = require './components'
{CourseListing} = require './components/course-listing'
{LearningGuideShell} = require './components/learning-guide'
{PerformanceShell} = require './components/performance'
TaskPlanShells = {ReadingShell, HomeworkShell} = require './components/task-plan'
{StudentDashboardShell} = require './components/student-dashboard'
TeacherTaskPlans = require './components/task-plan/teacher-task-plans-listing'
{TaskTeacherReviewShell} = require './components/task-teacher-review'
{ReferenceBookShell, ReferenceBookPageShell, ReferenceBookFirstPage} =
  require './components/reference-book'

{StatsShell} = require './components/task-plan/reading-stats'
capitalize = require 'underscore.string/capitalize'

Sandbox = require './sandbox'


# makes the following routes under the path of the pluralized plan type:
# createReading, createHomework
# editReading, editHomework
# viewReadingStats, viewHomeworkStats
# reviewReading, reviewHomework
# reviewReadingSection, reviewHomeworkSection
makePlanRoutes = (type) ->

  path = "#{type}s/"
  capType = capitalize(type)

  createAndEditHandler = "#{capType}Shell"
  TaskPlanShell = TaskPlanShells[createAndEditHandler]

  <Route path={path}>
    <Route path='new/?' name="create#{capType}" handler={TaskPlanShell} />
    <Route path=':id/?' name="edit#{capType}" >
      <Router.DefaultRoute handler={TaskPlanShell} />
      <Route path='stats/?' name="view#{capType}Stats" handler={StatsShell} />
      <Route path='summary/?' name="review#{capType}" handler={TaskTeacherReviewShell} >
        <Route
          path='section/:sectionIndex/'
          name="review#{capType}Section"
          ignoreScrollBehavior
        />
      </Route>
    </Route>
  </Route>

routes = (
  <Route handler={Root} name='root'>
    <Route path='/' handler={App} name='app'>
      <Redirect from='/' to='dashboard' />
      <Route path='dashboard/?' name='dashboard' handler={CourseListing} />
      <Route path='courses/:courseId/?'>
        <Route path='list/?' name='viewStudentDashboard' handler={StudentDashboardShell} />
        <Route path='tasks/:id/?' name='viewTask' handler={SingleTask}/>
        <Route path='tasks/:id/steps/:stepIndex/?'
          name='viewTaskStep'
          handler={SingleTask}
          ignoreScrollBehavior/>

        <Route path='practice/?' name='viewPractice' handler={SinglePractice} />
        <Route path='guide/?' name='viewGuide' handler={LearningGuideShell}/>

        <Route path='t/'>
          <Router.DefaultRoute handler={TeacherTaskPlans} />
          <Route path='performance/?' name='viewPerformance' handler={PerformanceShell} />
          <Route path='calendar/?' name='taskplans' handler={TeacherTaskPlans} />
          {makePlanRoutes('homework')}
          {makePlanRoutes('reading')}
        </Route>
      </Route>
      <Route path='sandbox/?' name='sandbox' handler={Sandbox} />
    </Route> # end of App route
    <Route path='/books/:courseId' name='viewReferenceBook' handler={ReferenceBookShell}>
      <Router.DefaultRoute name="viewReferenceBookFirstPage" handler={ReferenceBookFirstPage}/>
      <Route path='page/:cnxId' name='viewReferenceBookPage' handler={ReferenceBookPageShell}/>
    </Route>
    <NotFoundRoute handler={Invalid} />
  </Route>
)


# Remember the router for unit testing
router = Router.create
  routes: routes
  location: Router.HistoryLocation


start = (mountPoint) ->
  router.run (Handler) ->
    React.render(<Handler/>, mountPoint)

module.exports = {start, router, routes}
