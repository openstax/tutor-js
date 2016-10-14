{OXRouter} = require 'shared'

ROUTES = [
  { pattern: '/dashboard', name: 'listing' }
  {
    pattern: '/course/:courseId',  name: 'dashboard'
    routes: [
      { pattern: 'list',          name: 'viewStudentDashboard'  }
      { pattern: 't/month/:date', name: 'calendarByDate'        }
      {
        pattern: 'tasks/:id',     name: 'viewTask'
        routes: [{
          pattern: 'steps/:stepIndex', name: 'viewTaskStep'
          routes: [{
            pattern: ':milestones', name: 'viewTaskStepMilestones'
          }]
        }]
      }
      { pattern: 'homework/:id', name: 'editHomework' }
    ]

  }
  {
    pattern: '/books/:courseId', name: 'viewReferenceBook'
    routes: [
      { pattern: 'section/:section', name: 'viewReferenceBookSection' }
      { pattern: 'page/:cnxId', name: 'viewReferenceBookPage'         }
    ]
  }
]

TutorRouter = new OXRouter(ROUTES)

module.exports = TutorRouter
