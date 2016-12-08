React = require 'react'
classnames = require 'classnames'

{ReactHelpers} = require 'shared'

CourseChoiceItem = React.createClass
  displayName: 'CourseChoiceItem'
  propTypes:
    onClick:    React.PropTypes.func.isRequired
    className:  React.PropTypes.string
    children:   React.PropTypes.node
    active:     React.PropTypes.bool
    disabled:   React.PropTypes.bool

  render: ->
    <div
      className={classnames("list-group-item", "choice", @props.className, {
        active: @props.active, disabled: @props.disabled
      })}
      onClick={@props.onClick}
      {...ReactHelpers.filterProps(@props)}
    >
      {@props.children}
    </div>

module.exports = CourseChoiceItem
