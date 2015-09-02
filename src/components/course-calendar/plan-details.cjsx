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
    plan: React.PropTypes.object.isRequired

  renderReviewButton: ->
    {plan, courseId} = @props
    {type, id} = plan
    linkParams = {courseId, id}

    reviewButton = <Router.Link to='reviewTask' params={linkParams}>
      <BS.Button>Review Metrics</BS.Button>
    </Router.Link>

    if type is 'external'
      reviewButton = <Router.Link to='viewScores' params={linkParams}>
        <BS.Button>View Scores</BS.Button>
      </Router.Link>

    reviewButton

  render: ->
    {plan, courseId, className} = @props
    {title, type, id} = plan
    linkParams = {courseId, id}
    editLinkName = camelCase("edit-#{type}")

    reviewButton = @renderReviewButton()
    viewOrEdit = if plan.isEditable then 'Edit' else 'View'
    editButton = <Router.Link to={editLinkName} params={linkParams}>
      <BS.Button>{viewOrEdit} Assignment</BS.Button>
    </Router.Link>

    <BS.Modal
      {...@props}
      title={title}
      className="#{type}-modal plan-modal #{className}">
      <div className='modal-body'>
        <StatsModalShell id={id} courseId={courseId} />
      </div>
      <div className='modal-footer'>
        {reviewButton}
        {editButton}
      </div>
    </BS.Modal>


module.exports = CoursePlanDetails
