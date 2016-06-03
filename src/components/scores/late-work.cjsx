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
    if @state is 'accepted'
      TH.getHumanUnacceptedScore(@task)
    else
      TH.getHumanScoreWithLateWork(@task)

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

LateWorkPopover = React.createClass

  componentWillMount: ->
    Content = if @props.task.type is 'homework' then HomeworkContent else ReadingContent
    @setState(
      content: new Content(@props.task)
    )

  onButtonClick: ->
    if @state.content.isAccepted
      ScoresActions.rejectLate(@state.content.task.id)
    else
      ScoresActions.acceptLate(@state.content.task.id)
    @props.hide()

  render: ->
    {content} = @state

    <BS.Popover
      {...@props}
      show={@state.isShown}
      arrowOffsetTop={95}
      title={content.get('title')}
      id="late-work-info-popover-#{content.task.id}"
      className={content.className()}>
        <div className='late-status'>
          {content.get('body')}
          <div className='description'>
            <span className='title'>
              {content.reportingOn} on {content.lateDueDate()}:
            </span>
            <span className='status'>{content.score()}</span>
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
