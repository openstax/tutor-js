classnames = require 'classnames'
React = require 'react'
BS = require 'react-bootstrap'
{ Link } = require 'react-router'

{StatsModalShell} = require '../plan-stats'
{EventModalShell} = require '../plan-stats/event'

LoadableItem = require '../loadable-item'

# TODO drag and drop, and resize behavior
CoursePlanDetails = React.createClass
  displayName: 'CoursePlanDetails'

  getInitialState: ->
    keepVisible: false

  getDefaultProps: ->
    hasReview: false

  propTypes:
    plan: React.PropTypes.shape(
      id: React.PropTypes.string.isRequired
      title: React.PropTypes.string.isRequired
      type: React.PropTypes.string.isRequired
    ).isRequired
    courseId: React.PropTypes.string.isRequired
    onHide: React.PropTypes.func.isRequired
    hasReview: React.PropTypes.bool

  renderReviewButton: ->
    {plan, courseId} = @props
    {type, id} = plan
    linkParams = {courseId, id}

    reviewButton = <Link
      className='btn btn-default'
      to="/courses/#{courseId}/t/plans/#{id}/summary/?">
      Review Metrics
    </Link>

    if type is 'external'
      reviewButton = <Link
        className='btn btn-default -view-scores'
        to="/courses/#{courseId}/t/scores/?">
        View Scores
      </Link>

    reviewButton

  componentWillReceiveProps: (nextProps) ->
    # Sometimes, this plan modal will be asked to update while it's opened.
    # i.e. when a plan is mid-publish on open, but completes publishing
    # while the modal is open.
    # In that case, make sure the modal remains open while it's content
    # is updating.
    @setState(keepVisible: true)

  render: ->
    {plan, courseId, className, isPublishing, isPublished, hasReview} = @props
    {title, type, id} = plan
    {keepVisible} = @state
    return null unless isPublishing or isPublished

    reviewButton = @renderReviewButton() if hasReview

    editPath = "/courses/#{courseId}/t/#{type}/#{id}"
    viewOrEdit = if plan.isEditable then 'Edit' else 'View'
    assignmentOrEvent = if type is 'event' then 'Event' else 'Assignment'
    editButton = <Link
      className='btn btn-default -edit-assignment'
      to={editPath}>
      {viewOrEdit} {assignmentOrEvent}
    </Link>

    body = if isPublished
      footer =  <div className='modal-footer'>
        {reviewButton}
        {editButton}
      </div>

      if type is 'event'
        <EventModalShell id={id} courseId={courseId} />
      else
        <StatsModalShell id={id} courseId={courseId} />

    else if isPublishing
      <p>This plan is publishing.</p>

    classes = classnames 'plan-modal', className,
      'in': keepVisible

    <BS.Modal
      {...@props}
      show={true}
      data-assignment-type={type}
      className={classes}>

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>{title}</BS.Modal.Title>
      </BS.Modal.Header>

      <div className='modal-body'>
        {body}
      </div>
      {footer}
    </BS.Modal>


module.exports = CoursePlanDetails
