React = require 'react'
ENTER = 'Enter'

Course = require './model'
ErrorList = require './error-list'

ConfirmJoin = React.createClass

  propTypes:
    course: React.PropTypes.instanceOf(Course)

  startConfirmation: ->
    @props.course.confirm(React.findDOMNode(@refs.input).value)

  onKeyPress: (ev) ->
    @startConfirmation() if ev.key is ENTER

  onConfirmKeyPress: (ev) ->
    @startConfirmation() if ev.key is ENTER

  cancelConfirmation: ->
    @props.course.resetToBlankState()

  render: ->
    <div className="form-group">
      <h3 className="text-center">
        Would you like to join {@props.course.description()}?
      </h3>
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
        <ErrorList course={@props.course} />

        <label className="col-sm-12">
          My Student ID is:
          <input ref='input' autoFocus
            onKeyPress={@onKeyPress} type="text" className="form-control" />
        </label>

        <div className="text-center">
          <button className="btn"
            onClick={@cancelConfirmation}>Cancel</button>
          <button className="btn btn-success"
            style={marginLeft: '3rem'}
            onClick={@startConfirmation}>Confirm</button>
        </div>
      </div>
    </div>

module.exports = ConfirmJoin
