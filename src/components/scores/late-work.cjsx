React      = require 'react'
BS         = require 'react-bootstrap'
Time       = require '../time'
classnames = require 'classnames'

{ScoresActions} = require '../../flux/scores'

TH = require '../../helpers/task'

class LateWork
  constructor: (@task) ->
    @isAccepted = @task.is_late_work_accepted
    @status = if @isAccepted
      if TH.hasAdditionalLateWork(@task) then 'additional' else 'accepted'
    else
      'pending'

  score: ->
    if @status is 'accepted'
      TH.getHumanUnacceptedScore(@task)
    else
      TH.getHumanScoreWithLateWork(@task)

  progress: ->
    if @status is 'accepted'
      TH.getHumanUnacceptedProgress(@task)
    else
      TH.getHumanProgressWithLateWork(@task)

  lateExerciseCount: ->
    @task.completed_exercise_count - @task.completed_on_time_exercise_count

  lateDueDate: ->
    if @status is 'accepted'
      'due date'
    else
      <Time date={@task.last_worked_at} format='shortest' />

  className: ->
    classnames( 'late-work-info-popover', @keyword, @status, {
      'is-accepted': @isAccepted
    })

  get: (type) ->
    @[type]()?[@status] or ''

class HomeworkContent extends LateWork

  reportingOn:  'Score'
  title: ->
    additional: "Additional late work"
    accepted:   "You accepted this student's late score."
    pending:    "#{@lateExerciseCount()} questions worked after the due date"
  button: ->
    additional: 'Accept new late score'
    accepted:   'Use this score'
    pending:    'Accept late score'
  body: ->
    additional:
      <div className="body">
        This student worked {TH.lateStepCount(@task)} questions
        after you accepted a late score
        on <Time date={@task.accepted_late_at} format='shortest' />.
      </div>


class ReadingContent extends LateWork

  reportingOn:  'Progress'
  title: ->
    additional: "Additional late work"
    accepted:   "You accepted this student's late reading progress."
    pending:    "Reading progress after the due date"
  button: ->
    additional: 'Accept new late score'
    accepted:   'Use this score'
    pending:    'Accept late score'
  body: ->
    null

LateWorkPopover = React.createClass

  componentWillMount: ->
    Content = if @props.task.type is 'homework' then HomeworkContent else ReadingContent
    @setState(
      content: new Content(@props.task)
    )

  onButtonClick: ->
    if @state.content.isAccepted and not TH.hasAdditionalLateWork(@props.task)
      ScoresActions.rejectLate(@state.content.task.id, @props.columnIndex)
    else
      ScoresActions.acceptLate(@state.content.task.id, @props.columnIndex)
    @props.hide()

  render: ->
    {content} = @state
    status = if @props.task.type is 'homework' then content.score() else content.progress()
    arrowOffsetTop = if TH.hasAdditionalLateWork(@props.task) then 128 else 95

    <BS.Popover
      {...@props}
      show={@state.isShown}
      arrowOffsetTop={arrowOffsetTop}
      title={content.get('title')}
      id="late-work-info-popover-#{content.task.id}"
      className={content.className()}>
        <div className='late-status'>
          {content.get('body')}
          <div className='description'>
            <span className='title'>
              {content.reportingOn} on {content.lateDueDate()}:
            </span>
            <span className='status'>{status}</span>
          </div>
          <BS.Button className='late-button' onClick={@onButtonClick}>
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
      accepted: @props.task.is_late_work_accepted and not TH.hasAdditionalLateWork(@props.task)
    })

    <BS.OverlayTrigger
      ref="overlay" placement="top" trigger="click" rootClose={true}
      overlay={<LateWorkPopover task={@props.task} columnIndex={@props.columnIndex} hide={@hide} />}
    >
      <div className="late-caret-trigger">
        <div className={caretClass}></div>
      </div>
    </BS.OverlayTrigger>


module.exports = {LateWork, LateWorkPopover}
