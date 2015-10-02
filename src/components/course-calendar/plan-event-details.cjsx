camelCase = require 'camelcase'

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{EventModalShell} = require '../plan-stats/event'

CourseEventDetails = React.createClass
  displayName: 'CourseEventDetails'

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
    editLinkName = camelCase("edit-#{type}")

    viewOrEdit = if plan.isEditable then 'Edit' else 'View'
    editButton = <Router.Link
      className='btn btn-default -edit-assignment'
      to={editLinkName}
      params={linkParams}>
      {viewOrEdit} Event
    </Router.Link>

    <BS.Modal
      {...@props}
      title={title}
      data-assignment-type={type}
      className="plan-modal #{className}">
      <div className='modal-body'>
        <EventModalShell id={id} courseId={courseId} />
      </div>
      <div className='modal-footer'>
        {editButton}
      </div>
    </BS.Modal>


module.exports = CourseEventDetails