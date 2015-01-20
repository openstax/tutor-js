React = require 'react'

module.exports = React.createClass
  displayName: 'DialogButton'

  render: ->
    classes = ['btn-dialog', 'green-text']
    classes.push('btn-dialog-danger') if @props.isDanger
    classes.push('right') if @props.isRight
    classes = classes.join(' ')

    <button className={classes} onClick={@props.onClick}>
      {@props.children}
    </button>
