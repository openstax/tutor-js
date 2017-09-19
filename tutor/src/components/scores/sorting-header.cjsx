React    = require 'react'
Router = require 'react-router-dom'

classnames = require 'classnames'

module.exports = React.createClass
  displayName: 'SortingHeader'

  propTypes:
    onSort:  React.PropTypes.func.isRequired
    sortKey: React.PropTypes.any.isRequired
    sortState: React.PropTypes.object.isRequired
    dataType: React.PropTypes.string

  onClick: ->
    @props.onSort(@props.sortKey, @props.dataType)

  render: ->
    ascDesc = if @props.sortState.asc then 'is-ascending' else 'is-descending'
    classNames = classnames('header-cell', 'sortable', @props.className, {
      "#{ascDesc}" : @props.sortState.key is @props.sortKey and @props.sortState.dataType is @props.dataType
    })

    <div
      data-assignment-type={@props.type}
      onClick={@onClick}
      className={classNames}>
        {@props.children}
    </div>
