React = require 'react'
BS = require 'react-bootstrap'
ENTER = 'Enter'

Course = require './model'
ErrorList = require './error-list'

ConfirmJoin = React.createClass

  propTypes:
    title: React.PropTypes.string.isRequired
    course: React.PropTypes.instanceOf(Course)

  startConfirmation: ->
    @props.course.confirm(@refs.input.getValue())

  onKeyPress: (ev) ->
    @startConfirmation() if ev.key is ENTER

  onConfirmKeyPress: (ev) ->
    @startConfirmation() if ev.key is ENTER

  cancelConfirmation: ->
    @props.course.resetToBlankState()

  render: ->
    <div className="form-group">
      <h3 className="text-center">
        {@props.title}
      </h3>
      <ErrorList course={@props.course} />
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">

        <BS.Input type="text" ref="input" label="My Student ID is:"
          placeholder="Student ID" autoFocus
          onKeyPress={@onKeyPress}
        />

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
