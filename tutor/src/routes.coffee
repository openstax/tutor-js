{CourseListing} = require './components/course-listing'

{StudentDashboardShell} = require './components/student-dashboard'
TeacherTaskPlans = require './components/task-plan/teacher-task-plans-listing'
matchPattern = require('react-router/matchPattern').default

RH = require './helpers/routing'

Routes = [
  { pattern: '/dashboard', name: 'listing', component: CourseListing }
  {
    pattern: '/courses/:courseId', name: 'dashboard',
    render: RH.studentOrTeacher(StudentDashboardShell, TeacherTaskPlans)
    routes: [
      { pattern: '/list', component: StudentDashboardShell }

    ]
  }
]

findPattern = (pathname, parentRoutes) ->
  for entry in parentRoutes
    {pattern, routes} = entry
    if (match = matchPattern(pattern, {pathname}, false))
      return {entry, match}
    else if routes
      if (result = findPattern(pathname, pattern, routes))
        return result

module.exports =
  root: Routes
  pathToEntry: (path) -> findPattern(path, Routes)
