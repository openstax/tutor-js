React = require 'react'
BS = require 'react-bootstrap'

CoursePlanPublishingDetails = React.createClass
  displayName: 'CoursePlanPublishingDetails'

  propTypes:
    plan: React.PropTypes.shape(
      id: React.PropTypes.string.isRequired
      title: React.PropTypes.string.isRequired
      type: React.PropTypes.string.isRequired
    ).isRequired
    courseId: React.PropTypes.string.isRequired
    onRequestHide: React.PropTypes.func.isRequired

  render: ->
    {plan, courseId, className} = @props
    {title, type, id} = plan
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
