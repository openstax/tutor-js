React = require 'react'
BS = require 'react-bootstrap'

CoursePlanPublishingDetails = React.createClass
  displayName: 'CoursePlanPublishingDetails'

  propTypes:
    plan: React.PropTypes.object.isRequired

  render: ->
    {plan, courseId, className} = @props
    {title, type, id, isPublishing, publish_last_requested_at} = plan
    linkParams = {courseId, id}

    <BS.Modal
      {...@props}
      title={title}
      className="#{type}-modal plan-modal #{className}">
      <div className='modal-body'>
        This plan is publishing.
      </div>
    </BS.Modal>


module.exports = CoursePlanPublishingDetails
