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

    @displayValue =
        if @isAccepted
          @task.correct_on_time_exercise_count + @task.correct_accepted_late_exercise_count
        else
          @task.correct_on_time_exercise_count

  timeDisplay: ->
    if @isAccepted
      'due date'
    else
      <Time date={@task.last_worked_at} format='shortest'/>

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

LateWorkPopover = React.createClass

  componentWillMount: ->
    Content = if @props.task.type is 'homework' then HomeworkContent else ReadingContent
    @setState(
      content: new Content(@props.task)
    )

  onLateScoreAcceptance: ->
    ScoresActions.acceptLate(@state.content.task.id)
    @props.hide()

  render: ->
    {content} = @state

    <BS.Popover
      {...@props}
      show={@state.isShown}
      title={content.get('title')}
      id="late-work-info-popover-#{content.task.id}"
      className={content.className()}>
        <div className='late-status'>
          <div className='description'>
            <span className='title'>
              {"#{content.keyword} on "}
              {content.timeDisplay()}:
            </span>
            <span className='status'>{content.displayValue}</span>
          </div>
          <BS.Button className='late-button' onClick={@onLateScoreAcceptance}>
            {content.get('button')}
          </BS.Button>
        </div>
    </BS.Popover>



LateWork = React.createClass
  displayName: 'LateWork'

  getInitialState: ->
    isShown: true

  hide: ->
    @refs.overlay.hide()

  render: ->
    caretClass = classnames('late-caret', {
      accepted: @props.task.is_late_work_accepted
    })

    <BS.OverlayTrigger
      ref="overlay" placement="top" trigger="click" rootClose={true}
      overlay={<LateWorkPopover task={@props.task} hide={@hide} />}
    >
      <div className="late-caret-trigger">
        <div className={caretClass}></div>
      </div>
    </BS.OverlayTrigger>


module.exports = {LateWork, LateWorkPopover}
