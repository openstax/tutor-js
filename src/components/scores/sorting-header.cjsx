React    = require 'react'
Router = require 'react-router'

module.exports = React.createClass
  displayName: 'SortingHeader'

  propTypes:
    onSort:  React.PropTypes.func.isRequired
    sortKey: React.PropTypes.any.isRequired
    sortState: React.PropTypes.object.isRequired


  onClick: ->
    @props.onSort(@props.sortKey)

  render: ->
    classNames = ['header-cell', @props.className]
    if @props.sortState.key is @props.sortKey
      classNames.push if @props.sortState.asc then 'is-ascending' else 'is-descending'

    <div
      data-assignment-type={@props.type}
      onClick={@onClick}
      className={classNames.join(' ')}>
        {@props.children}
    </div>
