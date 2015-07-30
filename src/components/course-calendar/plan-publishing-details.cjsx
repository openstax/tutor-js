
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

# TODO drag and drop, and resize behavior
CoursePlanDetails = React.createClass
  displayName: 'CoursePlanPublishingDetails'

  propTypes:
    plan: React.PropTypes.object.isRequired

  render: ->
    {plan, courseId, className} = @props
    {title, type, id, isPublishing, publish_last_requested_at} = plan
    linkParams = {courseId, id}
    editLinkName = camelCase("edit-#{type}")

    reviewButton = @renderReviewButton()

    <BS.Modal
      {...@props}
      title={title}
      className="#{type}-modal plan-modal #{className}">
      <div className='modal-body'>
        <StatsModalShell id={id} courseId={courseId} />
      </div>
      <div className='modal-footer'>
        {reviewButton}
        <Router.Link to={editLinkName} params={linkParams}>
          <BS.Button>Edit Assignment</BS.Button>
        </Router.Link>
      </div>
    </BS.Modal>


module.exports = CoursePlanDetails
