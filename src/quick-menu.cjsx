# @cjsx React.DOM

React = require 'react'
require 'react/addons'

QuickButton = React.createClass

  getDefaultProps: () ->
    hidden: false
    actionText: ""

  propTypes:
    hidden: React.PropTypes.bool
    onAction: React.PropTypes.func.isRequired
    actionName: React.PropTypes.string.isRequired
    actionText: React.PropTypes.string.isRequired
    actionTitle: React.PropTypes.string
    icon: React.PropTypes.string

  handleAction: (evt) ->
    evt.stopPropagation() # Prevent an element from toggling from View to Edit when clicking on QuickMenu
    @props.onAction(@props.actionName)

  render: () ->
    classes =
      hidden: @props.hidden
      'quick-button btn btn-link': true

    iconClasses =
      'fa': true
    iconClasses[@props.icon] = true

    classes = React.addons.classSet classes
    iconClasses = React.addons.classSet iconClasses

    <button className={classes}
      title={@props.actionTitle}
      name={@props.actionName}
      onClick={@handleAction}>
      <i className={iconClasses}></i>
      {@props.actionText}
    </button>


QuickMenu = React.createClass
  render: ->
    <span className="quick-menu">
      <span className="quick-menu-body">
        {@props.children}
      </span>
    </span>

module.exports = {QuickButton, QuickMenu}
