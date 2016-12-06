React = require 'react'
_ = require 'underscore'

ErrorList = React.createClass

  propTypes:
    errorMessages: React.PropTypes.array.isRequired

  render: ->
    return null if _.isEmpty(@props.errorMessages)
    <div className="alert alert-danger">
      <ul className="errors">
        {for msg, i in @props.errorMessages
          <li key={i}>{msg}</li>}
      </ul>
    </div>


module.exports = ErrorList
