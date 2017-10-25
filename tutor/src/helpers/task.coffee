moment = require 'moment'
_ = require 'underscore'
{TimeStore} = require '../flux/time'

module.exports = {

  getLateness: ({due_at, last_worked_at, status}) ->

    result =
      is_late: false
      last_worked_at: null
      how_late: null

    result.last_worked_at = moment(last_worked_at)
    result.is_late  = moment(due_at).isBefore(result.last_worked_at)
    result.how_late = moment(due_at).from(result.last_worked_at, true) if result.is_late
    result

  isDue: ({due_at}) ->
    moment(due_at).isBefore(TimeStore.getNow())

  getHumanUnacceptedScore: (task) ->
    score = Math.round((
      task.correct_on_time_exercise_count / task.exercise_count
      ) * 100 )
    "#{score}%"

  getHumanScoreWithLateWork: (task) ->
    score = Math.round((
      task.correct_exercise_count / task.exercise_count
      ) * 100 )
    "#{score}%"

  getHumanUnacceptedProgress: (task) ->
    progress = Math.round((
      task.completed_on_time_exercise_count / task.exercise_count
      ) * 100 )
    "#{progress}%"

  getHumanProgressWithLateWork: (task) ->
    percent =
      if task.type is 'homework'
        task.completed_exercise_count / task.exercise_count
      else
        task.completed_step_count / task.step_count
    progress = Math.round(percent * 100)
    "#{progress}%"

  getCompletedSteps: (task) ->
    task.completed_on_time_step_count + task.completed_accepted_late_step_count

  getCompletedPercent: (task) ->
    if task.type is 'homework'
      score = task.completed_on_time_exercise_count + task.completed_accepted_late_exercise_count
      percent = Math.round( (score / task.exercise_count) * 100 )
    else
      score = task.completed_on_time_step_count + task.completed_accepted_late_step_count
      percent = Math.round( (score / task.step_count) * 100 )

  getScorePercent: (task) ->
    if task.type is 'homework'
      score = task.correct_on_time_exercise_count + task.correct_accepted_late_exercise_count
      percent = Math.round( (score / task.exercise_count) * 100 )
    else
      score = task.correct_on_time_step_count + task.correct_accepted_late_step_count
      percent = Math.round( (score / task.step_count) * 100 )

  getScoreNumber: (task) ->
    if task.type is 'homework'
      score = task.correct_on_time_exercise_count + task.correct_accepted_late_exercise_count
    else
      score = task.correct_on_time_step_count + task.correct_accepted_late_step_count

  hasAdditionalLateWork: (task) ->
    task.completed_accepted_late_step_count and (
      task.completed_step_count >  task.completed_on_time_step_count +
        task.completed_accepted_late_step_count
    )

  isLateAccepted: (task) ->
    task.is_late_work_accepted

  isHomeworkTaskStarted: (task) ->
    !!task.completed_exercise_count

  # called by readings and homework UI to determine if there's late work

  getHumanProgress: (task) ->
    complete = @getCompletedSteps(task)
    "#{complete} of #{task.step_count}"

  getHumanDueDate: (task) ->
    task.due_at

  getHumanCompletedPercent: (task) ->
    "#{@getCompletedPercent(task)}%"

  getHumanScorePercent: (task) ->
    "#{@getScorePercent(task)}%"

  getHumanScoreNumber: (task) ->
    "#{@getScoreNumber(task)} of #{task.step_count}"

  getHumanStatus: (task, options = {displayAs: 'number'}) ->
    if options.displayAs is 'number'
      @getHumanProgress(task)
    else
      @getHumanCompletedPercent(task)


}
