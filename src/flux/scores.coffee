# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

{TimeStore} = require './time'

ACCEPTING = 'accepting'
ACCEPTED = 'accepted'

REJECTING = 'rejecting'
REJECTED = 'rejected'


allStudents = (scores) ->
  _.chain(scores)
    .pluck('students')
    .flatten(true)
    .value()

getTaskInfoById = (taskId, data) ->
  taskId = parseInt(taskId, 10)
  for courseId, period of data
    for period, periodIndex in data[courseId]
      for student, studentIndex in period.students
        for task in student.data
          if task.id is taskId
            return {task, courseId, period, periodIndex, studentIndex}


adjustTaskAverages = (data, taskInfo) ->
  {task} = taskInfo
  oldScore = task.score
  task.score = Math.round((
    (task.correct_on_time_exercise_count + task.correct_accepted_late_exercise_count ) /
      task.exercise_count
  ) * 100 ) / 100

  course = data[taskInfo.courseId][0]

  studentCount = course.students.length
  heading = course.data_headings[taskInfo.periodIndex]
  heading.average_score =
    ( heading.average_score - ( oldScore / studentCount ) ) +
      ( task.score / studentCount )

  taskCount = 0
  for student in course.students
    taskCount += 1 for studentTask in student.data when studentTask.is_included_in_averages

  course.overall_average_score =
    (course.overall_average_score - ( oldScore / taskCount ) ) +
      ( task.score / taskCount )


ScoresConfig = {

  _asyncStatus: {}

  hasLateWork: (task) ->
    task.completed_step_count > task.completed_on_time_step_count +
      task.completed_accepted_late_step_count

  ######################################################################
  ## The accept / reject methods mirror Tutor-Server logic.           ##
  ## See: app/subsystems/tasks/models/task.rb                         ##
  ######################################################################

  acceptLate: (taskId) ->
    @_asyncStatus[taskId] = ACCEPTING
    taskInfo = getTaskInfoById(taskId, @_local)
    {task} = taskInfo

    # nothing to do if it's not actually late
    return unless @hasLateWork(task)

    task.is_late_work_accepted = true

    task.completed_accepted_late_exercise_count =
      task.completed_exercise_count - task.completed_on_time_exercise_count
    task.correct_accepted_late_exercise_count =
      task.correct_exercise_count - task.correct_on_time_exercise_count
    task.completed_accepted_late_step_count =
      task.completed_step_count - task.completed_on_time_step_count

    task.accepted_late_at = TimeStore.getNow().toISOString()

    adjustTaskAverages(@_local, taskInfo)

    @emitChange()

  acceptedLate: (unused, taskId, courseId) ->
    @_asyncStatus[taskId] = ACCEPTED
    @emitChange()

  rejectLate: (taskId) ->
    @_asyncStatus[taskId] = REJECTING
    taskInfo = getTaskInfoById(taskId, @_local)
    {task} = taskInfo
    task.is_late_work_accepted = false
    task.correct_accepted_late_exercise_count = 0
    task.completed_accepted_late_exercise_count = 0
    task.completed_accepted_late_step_count = 0
    delete task.accepted_late_at

    adjustTaskAverages(@_local, taskInfo)

    @emitChange()

  rejectedLate: (unused, taskId, courseId) ->
    @_asyncStatus[taskId] = REJECTED
    @emitChange()


  exports:

    getTaskInfoById: (taskId) ->
      getTaskInfoById(taskId, @_local)

    getStudent: (courseId, roleId) ->
      students = allStudents @_get(courseId)
      # TODO remove parseInt when BE fixes role to be string
      _.findWhere(allStudents(@_get(courseId)), role: parseInt(roleId))

    getAllStudents: (courseId) ->
      allStudents @_get(courseId)

    getStudentOfTask: (courseId, taskId) ->
      students = allStudents @_get(courseId)

      # TODO remove when BE fixed for ids to be strings instead of numbers
      taskId = parseInt(taskId)

      _.find students, (student) ->
        taskIds = _.pluck student.data, 'id'
        _.indexOf(taskIds, taskId) > -1

    isUpdatingLateStatus: (taskId) ->
      @_asyncStatus[taskId] is ACCEPTING or
      @_asyncStatus[taskId] is REJECTING


}

extendConfig(ScoresConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ScoresConfig)
module.exports = {ScoresActions:actions, ScoresStore:store}
