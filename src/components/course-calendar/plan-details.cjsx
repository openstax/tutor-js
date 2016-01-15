camelCase = require 'camelcase'
classnames = require 'classnames'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{StatsModalShell} = require '../plan-stats'
{EventModalShell} = require '../plan-stats/event'

LoadableItem = require '../loadable-item'

# TODO drag and drop, and resize behavior
CoursePlanDetails = React.createClass
  displayName: 'CoursePlanDetails'

  getInitialState: ->
    forceOpen: false

  propTypes:
    plan: React.PropTypes.shape(
      id: React.PropTypes.string.isRequired
      title: React.PropTypes.string.isRequired
      type: React.PropTypes.string.isRequired
    ).isRequired
    courseId: React.PropTypes.string.isRequired
    onRequestHide: React.PropTypes.func.isRequired

  renderReviewButton: ->
    {plan, courseId} = @props
    {type, id} = plan
    linkParams = {courseId, id}

    reviewButton = <Router.Link
      className='btn btn-default'
      to='reviewTask'
      params={linkParams}>
      Review Metrics
    </Router.Link>

    if type is 'external'
      reviewButton = <Router.Link
        className='btn btn-default -view-scores'
        to='viewScores'
        params={linkParams}>
        View Scores
      </Router.Link>

    reviewButton

  componentWillReceiveProps: (nextProps) ->
    @setState(forceOpen: true)

  render: ->
    {plan, courseId, className, isPublishing, isPublished} = @props
    {title, type, id} = plan
    linkParams = {courseId, id}
    {forceOpen} = @state
    return null unless isPublishing or isPublished

    reviewButton = @renderReviewButton() unless type is 'event'

    editLinkName = camelCase("edit-#{type}")
    viewOrEdit = if plan.isEditable then 'Edit' else 'View'
    assignmentOrEvent = if type is 'event' then 'Event' else 'Assignment'
    editButton = <Router.Link
      className='btn btn-default -edit-assignment'
      to={editLinkName}
      params={linkParams}>
      {viewOrEdit} {assignmentOrEvent}
    </Router.Link>

    body = if isPublishing
      <p>This plan is publishing.</p>
    else if type is 'event'
      <EventModalShell id={id} courseId={courseId} />
    else
      <StatsModalShell id={id} courseId={courseId} />

    footer = unless isPublishing
      <div className='modal-footer'>
        {reviewButton}
        {editButton}
      </div>

    classes = classnames 'plan-modal', className,
      'in': forceOpen

    <BS.Modal
      {...@props}
      title={title}
      data-assignment-type={type}
      className={classes}>
      <div className='modal-body'>
        {body}
      </div>
      {footer}
    </BS.Modal>


module.exports = CoursePlanDetails
