React = require 'react'
BS = require 'react-bootstrap'
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
    onSelect: React.PropTypes.func


  onSelect: (selection) ->
    @props.onSelect?( _.findWhere(@props.selections, id: selection))

  renderMenuSelection: (selection) ->
    <BS.MenuItem key={selection.id} eventKey={selection.id}>
      <Icon type={if selection.selected then 'check-square-o' else 'square-o'} />
      {selection.title}
    </BS.MenuItem>

  render: ->
    classNames = classnames('multi-select', @props.className)
    <BS.DropdownButton
      navItem={@props.navItem}
      className={classNames}
      onSelect={@onSelect}
      title={@props.title}
    >
      {@renderMenuSelection(selection) for selection in @props.selections}
    </BS.DropdownButton>



module.exports = MultiSelect
