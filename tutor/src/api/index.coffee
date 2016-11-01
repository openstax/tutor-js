{setUpAPIHandler, connectToAPIHandler, updateRequestHandlers, makeIdRouteData, makeDefaultRequestData,
  createActions, readActions, updateActions, deleteActions, actionFrom, createFrom, readFrom, updateFrom,
  deleteFrom, connectAsAction, connectTrigger} = require './adapter'

{CurrentUserActions} = require '../flux/current-user'
{CourseActions} = require '../flux/course'
{CoursePracticeActions} = require '../flux/practice'
{CourseGuideActions} = require '../flux/guide'
{JobActions} = require '../flux/job'
{EcosystemsActions} = require '../flux/ecosystems'
PerformanceForecast = require '../flux/performance-forecast'

{ScoresActions} = require '../flux/scores'
{ScoresExportActions} = require '../flux/scores-export'
{RosterActions, RosterStore} = require '../flux/roster'
{PeriodActions} = require '../flux/period'

{TaskActions} = require '../flux/task'
{TaskPanelActions} = require '../flux/task-panel'
{TaskStepActions} = require '../flux/task-step'
{StudentIdActions} = require '../flux/student-id'
{TaskPlanActions, TaskPlanStore} = require '../flux/task-plan'
{TaskTeacherReviewActions} = require '../flux/task-teacher-review'
{TaskPlanStatsActions} = require '../flux/task-plan-stats'

{TocActions} = require '../flux/toc'
{ExerciseActions, ExerciseStore} = require '../flux/exercise'
{TeacherTaskPlanActions} = require '../flux/teacher-task-plan'
{StudentDashboardActions} = require '../flux/student-dashboard'
{CourseListingActions} = require '../flux/course-listing'
{CCDashboardActions} = require '../flux/cc-dashboard'

{ReferenceBookActions} = require '../flux/reference-book'
{ReferenceBookPageActions} = require '../flux/reference-book-page'
{ReferenceBookExerciseActions} = require '../flux/reference-book-exercise'
{NewCourseActions, NewCourseStore} = require '../flux/new-course'
{NotificationActions} = require '../flux/notifications'


startAPI = ->
  setUpAPIHandler()

  connectAsAction('read', TaskActions, 'task')
  connectAsAction('delete', TaskActions, 'task')
  connectAsAction('read', TaskPlanActions, 'task-plan')
  connectAsAction('delete', TaskPlanActions, 'task-plan')

  updateRequestHandlers(TaskPlanActions, onSuccess: 'saved', createFrom('task-plan'))
  updateRequestHandlers(TaskPlanActions, onSuccess: 'saved', updateFrom('task-plan'))
  connectTrigger(TaskPlanActions, trigger: 'save', (id, courseId) ->
    subject = 'task-plan'
    requestData = TaskPlanStore.getChanged(id)
    routeData = {id, courseId}

    requestInfo = if TaskPlanStore.isNew(id)
      subject: subject
      topic: courseId
      action: 'create'
    else
      subject: subject
      topic: id
      action: 'update'

    {requestInfo, routeData, requestData}
  )

  connectAsAction('read', TaskPlanStatsActions, 'task-plan-stats')
  connectAsAction('read', TaskTeacherReviewActions, 'task-plan-review')

  connectToAPIHandler(
    ExerciseActions,
    {
      trigger: 'loadForEcosystem'
      onSuccess: 'loadedForEcosystem'
    },
    readFrom('ecosystem-exercises'),
    (id, pageIds, requestType = 'homework_core') ->
      {id, requestType}
    ,
    (id, pageIds, requestType = 'homework_core') ->
      params =
        page_ids: pageIds

      {params}
  )
  connectToAPIHandler(
    ExerciseActions,
    {
      trigger: 'loadForCourse'
      onSuccess: 'loadedForCourse'
    },
    readFrom('course-exercises'),
    (id, pageIds, ecosystemId = null, requestType = 'homework_core') ->
      {id, requestType}
    ,
    (id, pageIds, ecosystemId = null, requestType = 'homework_core') ->
      params =
        page_ids: pageIds
      params.ecosystem_id = ecosystemId if ecosystemId?

      {params}
  )
  connectToAPIHandler(
    ExerciseActions,
    {
      trigger: 'saveExerciseExclusion'
      onSuccess: 'exclusionsSaved'
    },
    actionFrom('exclude', 'course-exercises'),
    makeIdRouteData,
    ->
      data = _.map ExerciseStore.getUnsavedExclusions(), (is_excluded, id) -> {id, is_excluded}
      {data}
  )

  connectAsAction('read', TocActions, 'ecosystem-readings')
  connectAsAction('read', CourseGuideActions, 'course-guide')
  connectAsAction('read', CourseActions, 'course')
  connectAsAction('update', CourseActions, 'course')
  connectAsAction('read', CCDashboardActions, 'course-dashboard-teacher-cc')
  connectAsAction('create', CoursePracticeActions, 'course-practice')
  connectAsAction('read', CoursePracticeActions, 'course-practice')

  connectAsAction('read', PerformanceForecast.Student.actions, 'course-performance-forecast-student')
  connectAsAction('read', PerformanceForecast.Teacher.actions, 'course-performance-forecast-teacher')
  connectToAPIHandler(
    PerformanceForecast.TeacherStudent.actions,
    readActions,
    readFrom('course-performance-forecast-teacher'),
    (id, {roleId}) ->
      {id, roleId}
  )
  connectAsAction('read', ScoresActions, 'course-scores')
  connectAsAction('read', ScoresExportActions, 'course-scores-export')
  connectToAPIHandler(
    ScoresExportActions,
    {trigger: 'export', onSuccess: 'exported'},
    createFrom('course-scores-export'),
    makeIdRouteData
  )
  connectToAPIHandler(
    ScoresActions,
    {trigger: 'acceptLate', onSuccess: 'acceptedLate'},
    {subject: 'task-scores', action: 'accept-late-work'},
    makeIdRouteData
  )
  connectToAPIHandler(
    ScoresActions,
    {trigger: 'rejectLate', onSuccess: 'rejectedLate'},
    {subject: 'task-scores', action: 'reject-late-work'},
    makeIdRouteData
  )

  connectToAPIHandler(
    TeacherTaskPlanActions,
    readActions,
    readFrom('course-dashboard-teacher'),
    makeIdRouteData,
    (id, startAt, endAt) ->
      params =
        start_at: startAt
        end_at: endAt
      {params}
  )
  connectAsAction('read', JobActions, 'job')
  connectAsAction('read', EcosystemsActions, 'ecosystem')
  connectToAPIHandler(
    RosterActions,
    {trigger: 'teacherDelete', onSuccess: 'teacherDeleted'},
    deleteFrom('teacher'),
    makeIdRouteData
  )
  connectAsAction('delete', RosterActions, 'student')
  connectAsAction('update', RosterActions, 'student')
  connectToAPIHandler(
    RosterActions,
    {trigger: 'undrop', onSuccess: 'undropped'},
    {
      subject: 'student'
      action: 'undrop'
      errorHandlers:
        already_active: 'onUndropAlreadyActive'
        student_identifier_has_already_been_taken: 'recordDuplicateStudentIdError'
    },
    makeIdRouteData
  )
  connectToAPIHandler(
    RosterActions,
    {trigger: 'saveStudentIdentifier', onSuccess: 'savedStudentIdentifier'},
    {
      subject: 'student'
      action: 'save-student-identifier'
      errorHandlers:
        student_identifier_has_already_been_taken: 'recordDuplicateStudentIdError'
    },
    makeIdRouteData,
    ({courseId, studentId}) ->
      student_identifier: RosterStore.getStudentIdentifier(courseId, studentId)
  )
  connectAsAction('create', RosterActions, 'course-roster')
  connectAsAction('read', RosterActions, 'course-roster')
  connectToAPIHandler(
    StudentIdActions,
    updateActions,
    {
      subject: 'course-student-id'
      action: 'update'
      handleError: StudentIdActions.errored
    },
    makeIdRouteData,
    makeDefaultRequestData
  )

  connectAsAction('create', PeriodActions, 'period')
  connectAsAction('update', PeriodActions, 'period')
  connectAsAction('delete', PeriodActions, 'period')
  connectToAPIHandler(
    PeriodActions,
    {trigger: 'restore', onSuccess: 'restored'},
    {subject: 'period', action: 'restore'},
    makeIdRouteData
  )


  connectAsAction('read', TaskStepActions, 'step')
  connectToAPIHandler(
    TaskStepActions,
    {trigger: 'loadPersonalized', onSuccess: 'loaded'},
    {
      subject: 'step'
      action: 'personalize'
      handleError: TaskStepActions.loadedNoPersonalized
    },
    makeIdRouteData
  )
  connectToAPIHandler(
    TaskStepActions,
    {trigger: 'complete', onSuccess: 'completed'},
    {subject: 'step', action: 'complete'},
    makeIdRouteData
  )
  connectToAPIHandler(
    TaskStepActions,
    {trigger: 'loadRecovery', onSuccess: 'loadedRecovery'},
    {subject: 'step', action: 'recover'},
    makeIdRouteData
  )
  connectToAPIHandler(
    TaskStepActions,
    {trigger: 'setFreeResponseAnswer', onSuccess: 'saved'},
    {subject: 'step', action: 'answer'},
    makeIdRouteData,
    (id, freeResponse) ->
      {free_response: freeResponse}
  )
  connectToAPIHandler(
    TaskStepActions,
    {trigger: 'setAnswerId', onSuccess: 'saved'},
    {subject: 'step', action: 'answer'},
    makeIdRouteData,
    (id, answerId) ->
      {answer_id: answerId}
  )

  connectAsAction('read', CurrentUserActions, 'user')
  connectAsAction('read', CourseListingActions, 'user-courses')
  connectToAPIHandler(
    NewCourseActions,
    {trigger: 'clone', onSuccess: 'created'},
    updateFrom('course-clone'),
    makeIdRouteData,
    NewCourseStore.requestPayload
  )
  connectToAPIHandler(
    NewCourseActions,
    createActions,
    createFrom('course'),
    makeIdRouteData,
    NewCourseStore.requestPayload
  )

  connectAsAction('read', ReferenceBookActions, 'ecosystem-readings')
  connectAsAction('read', ReferenceBookPageActions, 'book-page')
  connectToAPIHandler(
    ReferenceBookPageActions,
    {trigger: 'loadSilent', onSuccess: 'loaded'},
    {action: 'read-silent', subject: 'book-page'},
    makeIdRouteData
  )
  connectToAPIHandler(
    ReferenceBookExerciseActions,
    readActions,
    readFrom('book-exercise'),
    (url) -> {url}
  )

  connectAsAction('read', StudentDashboardActions, 'course-dashboard-student')
  connectToAPIHandler(
    NotificationActions,
    {trigger: 'loadUpdates', onSuccess: 'loadedUpdates'},
    readFrom('notifications')
  )

module.exports = {startAPI}
