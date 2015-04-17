moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react'
BS = require 'react-bootstrap'

# TODO drag and drop, and resize behavior
CoursePlanDetails = React.createClass
  displayName: 'CoursePlanDetails'

  propTypes:
    item: React.PropTypes.object.isRequired

  render: ->
    {plan} = @props

    <BS.Modal {...@props} title={plan.title} className="#{plan.type}-modal">
      <div className='modal-body'>
        <h1>Hello!</h1>
      </div>
      <div className='modal-footer'>
        <BS.Button>Review Metrics</BS.Button>
        <BS.Button>Edit Assignment</BS.Button>
        <BS.Button>Reference View</BS.Button>
      </div>
    </BS.Modal>


module.exports = CoursePlanDetails
