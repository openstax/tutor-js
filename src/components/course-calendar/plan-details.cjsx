moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'
camelCase = require 'camelcase'

React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{StatsModalShell} = require '../task-plan/reading-stats'
LoadableItem = require '../loadable-item'

# TODO drag and drop, and resize behavior
CoursePlanDetails = React.createClass
  displayName: 'CoursePlanDetails'

  propTypes:
    plan: React.PropTypes.object.isRequired

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {plan, courseId, className} = @props
    {title, type, id} = plan
    linkParams = {courseId, id}
    editLinkName = camelCase("edit-#{type}")

    <BS.Modal
      {...@props}
      title={title}
      className="#{type}-modal plan-modal #{className}">
      <div className='modal-body'>
        <StatsModalShell id={id}/>
      </div>
      <div className='modal-footer'>
        <Router.Link to='reviewTask' params={linkParams}>
          <BS.Button>Review Metrics</BS.Button>
        </Router.Link>
        <Router.Link to={editLinkName} params={linkParams}>
          <BS.Button>Edit Assignment</BS.Button>
        </Router.Link>
      </div>
    </BS.Modal>


module.exports = CoursePlanDetails
