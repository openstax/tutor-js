React = require 'react'

module.exports = React.createClass
  displayName: 'PrimaryAdd'
  render: ->
    <button
      title={@props.title}
      className="btn-floating btn-large waves-effect waves-light red btn-primary"
      onClick={@props.onClick}>
      <i className="mdi-content-add"></i>
    </button>
