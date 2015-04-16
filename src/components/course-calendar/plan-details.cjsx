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

    <BS.Modal {...@props} title={plan.title}>
      <div className='modal-body'>
        <h1>Hello!</h1>
      </div>
    </BS.Modal>


module.exports = CoursePlanDetails
