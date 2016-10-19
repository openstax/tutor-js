{OXRouter} = require 'shared'

# The components for these names are listend in ../src/router
ROUTES = [
  { pattern: '/dashboard', name: 'listing' }
  {
    pattern: '/course/:courseId', name: 'dashboard'
    routes: [
      { pattern: 'scores',        name: 'viewScores'     }
      { pattern: 'guide/:roleId?',         name: 'viewPerformanceGuide' }
      { pattern: 'list',          name: 'viewStudentDashboard'  }
      {
        pattern: 't', name: 'viewTeacherDashboard'
        routes: [
          {
            pattern: 'guide', name: 'viewTeacherPerformanceForecast'
            routes: [{
              pattern: 'student/:roleId', name: 'viewStudentTeacherPerformanceForecast'
            }]
          }, {
            pattern: 'month/:date', name: 'calendarByDate'
            routes: [{
              pattern: 'plan/:planId', name: 'calendarViewPlanStats'
            }]
          }
        ]
      }
      {
        pattern: 'tasks/:id',     name: 'viewTask'
        routes: [{
          pattern: 'steps/:stepIndex', name: 'viewTaskStep'
          routes: [{
            pattern: ':milestones', name: 'viewTaskStepMilestones'
          }]
        }]
      }
      { pattern: 'homework/new', name: 'createHomework' }
      { pattern: 'homework/:id', name: 'editHomework'   }
      { pattern: 'reading/new',  name: 'createReading'  }
      { pattern: 'reading/:id',  name: 'editReading'    }
      { pattern: 'external/new', name: 'createExternal' }
      { pattern: 'external/:id', name: 'editExternal'   }
      { pattern: 'event/new',    name: 'createEvent'    }
      { pattern: 'event/:id',    name: 'editEvent'      }
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
