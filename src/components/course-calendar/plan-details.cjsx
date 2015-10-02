camelCase = require 'camelcase'

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{StatsModalShell} = require '../plan-stats'
LoadableItem = require '../loadable-item'

# TODO drag and drop, and resize behavior
CoursePlanDetails = React.createClass
  displayName: 'CoursePlanDetails'

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

  render: ->
    {plan, courseId, className} = @props
    {title, type, id} = plan
    linkParams = {courseId, id}
    editLinkName = camelCase("edit-#{type}")

    reviewButton = @renderReviewButton()
    viewOrEdit = if plan.isEditable then 'Edit' else 'View'
    editButton = <Router.Link
      className='btn btn-default -edit-assignment'
      to={editLinkName}
      params={linkParams}>
      {viewOrEdit} Assignment
    </Router.Link>

    <BS.Modal
      {...@props}
      title={title}
      data-assignment-type={type}
      className="plan-modal #{className}">
      <div className='modal-body'>
        <StatsModalShell id={id} courseId={courseId} />
      </div>
      <div className='modal-footer'>
        {reviewButton}
        {editButton}
      </div>
    </BS.Modal>


module.exports = CoursePlanDetails
