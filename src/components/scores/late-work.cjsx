React      = require 'react'
BS         = require 'react-bootstrap'
Time       = require '../time'
classnames = require 'classnames'

{ScoresStore, ScoresActions} = require '../../flux/scores'

class LateWork
  constructor: (@task) ->
    @status = if @task.is_late_work_accepted then 'accepted' else 'pending'
    @isAccepted = @task.is_late_work_accepted
    @allowedCount = @task.completed_on_time_exercise_count + @task.completed_accepted_late_exercise_count

    @isFullyAccepted =
      @task.completed_exercise_count is @allowedCount and
        @task.completed_accepted_late_exercise_count > 0

    @lateQuestionCount =
      @task.completed_exercise_count - @task.completed_on_time_exercise_count

  timeDisplay: ->
    if @isAccepted
      'due date'
    else
      <Time date={@task.last_worked_at} format='shortest'/>

  acceptedClass: ->
    if @isAccepted and @isFullyAccepted then 'accepted' else ''

  className: ->
    classnames( 'late-work-info-popover', @keyword, {
      accepted: @isAccepted
    })

  get: (type) ->
    @[type]()[@status]

class HomeworkContent extends LateWork
  keyword:  'homework'

  title: ->
    accepted: "You accepted this student's late score."
    pending:  "#{@lateQuestionCount} questions worked after the due date"
  button: ->
    accepted: 'Use this score'
    pending:  'Accept late score'

class ReadingContent extends LateWork
  keyword:  'reading'

  title: ->
    accepted: "You accepted this student's late reading progress."
    pending:  "Reading progress after the due date"
  button: ->
    accepted: 'Use this score'
    pending:  'Accept late score'

LateWork = React.createClass
  displayName: 'LateWork'

  componentWillMount: ->
    {task} = @props
    @setState(
      content: if task.type is 'homework' then new HomeworkContent(task) else ReadingContent(task)
    )

  onLateScoreAcceptance: ->
    ScoresActions.acceptLate(task.id, courseId)

  renderPopover: (content) ->
    <BS.Popover
      title={content.get('title')}
      id="late-work-info-popover-#{content.task.id}"
      className={content.className()}>
        <div className='late-status'>
          <div className='description'>
            <span className='title'>
              {"#{content.keyword} on "}
              {content.timeDisplay()}:
            </span>
            <span className='status'>{"#{Math.round(@props.acceptValue)}%"}</span>
          </div>
          <BS.Button className='late-button' onClick={@onLateScoreAcceptance}>
            {content.get('button')}
          </BS.Button>
        </div>
    </BS.Popover>

  render: ->
    {content} = @state

    <BS.OverlayTrigger
      ref="overlay" placement="top" trigger="click" rootClose={true}
      overlay={@renderPopover(content)}
    >

      <div className="late-caret-trigger" onClick={@showPopover}>
        <div className="late-caret #{content.acceptedClass()}"></div>
      </div>

    </BS.OverlayTrigger>



  # setLateStatus: ->
  #   {task, courseId, period_id, columnIndex, isIncludedInAverages, currentValue, acceptValue} = @props
  #   {content} = @state

  #   isAccepted = task.is_late_work_accepted
  #   isFullyAccepted =
  #     task.completed_accepted_late_exercise_count > 0 and
  #     task.completed_exercise_count == (task.completed_on_time_exercise_count + task.completed_accepted_late_exercise_count)

  #   console.log(isFullyAccepted)
  #   if not @isUpdatingLateStatus()
  #     if isAccepted and isFullyAccepted
  #       ScoresActions.rejectLate(task.id, courseId)
  #     else
  #       ScoresActions.acceptLate(task.id, courseId)

  #     if isIncludedInAverages
  #       updateAveragesParams = [
  #         task,
  #         courseId,
  #         period_id,
  #         columnIndex,
  #         currentValue,
  #         acceptValue
  #       ]
  #       ScoresActions.updateAverages(updateAveragesParams...)

  #   @refs.overlay.hide()


  # isUpdatingLateStatus: ->
  #   ScoresStore.isUpdatingLateStatus(@props.task.id)

    # isAccepted = task.is_late_work_accepted
    # lateQuestionCount =
    #   task.completed_exercise_count - task.completed_on_time_exercise_count
    # titleProgress =
    #   if task.type is 'homework'
    #     if not isAccepted
    #       "#{lateQuestionCount} questions worked after the due date"
    #     else
    #       'You accepted this student\'s late score.'
    #   else
    #     if not isAccepted
    #       'Reading progress after the due date'
    #     else
    #       'You accepted this student\'s late reading progress.'
    # title =
    #   if @isUpdatingLateStatus()
    #     <span>
    #       <i className='fa fa-spinner fa-spin'/> Updating...
    #     </span>
    #   else
    #     <span>{titleProgress}</span>
    # buttonLabel =
    #   if task.type is 'homework'
    #     if not isAccepted
    #       'Accept late score'
    #     else
    #       'Use this score'
    #   else
    #     if not isAccepted
    #       'Accept late progress'
    #     else
    #       'Use due date progress'

#    acceptedClass = if isAccepted then 'accepted' else ''
#    keyword = if task.type is 'homework' then 'Score' else 'Progress'
    # time =
    #   if isAccepted
    #     'due date'
    #   else
    #     <Time date={task.last_worked_at} format='shortest'/>



module.exports = LateWork
