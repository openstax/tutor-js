_     = require 'underscore'
React = require 'react'
BS    = require 'react-bootstrap'
classnames = require 'classnames'

Icon = require './icon'

MultiSelect = React.createClass

  propTypes:
    title:      React.PropTypes.string.isRequired
    className:  React.PropTypes.string
    selections: React.PropTypes.arrayOf(
      React.PropTypes.shape(
        id:       React.PropTypes.string
        title:    React.PropTypes.string
        selected: React.PropTypes.bool
      )
    ).isRequired
    onOnlySelection: React.PropTypes.func
    onSelect: React.PropTypes.func

  toggleOnly: (ev) ->
    ev.preventDefault()
    ev.stopPropagation()
    @props.onOnlySelection(ev.target.getAttribute('data-id'))

  onSelect: (selection) ->
    @props.onSelect?( _.findWhere(@props.selections, id: selection))

  renderMenuSelection: (selection) ->
    if @props.onOnlySelection
      onlyToggle = <span className="only" data-id={selection.id} onClick={@toggleOnly}>only</span>

    <BS.MenuItem
      key={selection.id}
      eventKey={selection.id}
      className="multi-selection-option"
    >
      <Icon type={if selection.selected then 'check-square-o' else 'square-o'} />
      <span className="title">{selection.title}</span>
      {onlyToggle}
    </BS.MenuItem>

  render: ->
    <div className={classnames('multi-select', @props.className)}>
       <BS.DropdownButton
         id='multi-select'
         onSelect={@onSelect}
         title={@props.title}
       >
         {@renderMenuSelection(selection) for selection in @props.selections}
       </BS.DropdownButton>
    </div>


module.exports = MultiSelect
