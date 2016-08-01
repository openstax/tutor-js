React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

ControlsOverlay = React.createClass

  propTypes:
    onClick:  React.PropTypes.func
    actions:  React.PropTypes.object
    exercise: React.PropTypes.object.isRequired

  onClick: (ev) ->
    @props.onClick(ev, @props.exercise)

  onActionClick: (ev, handler) ->
    ev.stopPropagation() if @props.onClick # needed to prevent click from triggering onOverlay handler
    handler(ev, @props.exercise)

  render: ->
    return null if _.isEmpty(@props.actions)

    <div
      onClick={@onClick if @props.onClick}
      className={classnames('controls-overlay', {active: @props.isSelected})}
    >
      <div className='message'>
        {for type, action of @props.actions
          <div key={type}
            className="action #{type}"
            onClick={_.partial(@onActionClick, _, action.handler)}
          >
            <span>{action.message}</span>
          </div>}
      </div>
    </div>


module.exports = ControlsOverlay
