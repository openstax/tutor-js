React    = require 'react'
Router = require 'react-router'

module.exports = React.createClass
  displayName: 'SortingHeader'

  propTypes:
    onSort:  React.PropTypes.func.isRequired
    sortKey: React.PropTypes.any.isRequired
    sortState: React.PropTypes.object.isRequired
    dataType: React.PropTypes.string

  onClick: ->
    @props.onSort(@props.sortKey, @props.children.ref)

  isSplitHeader: ->
    if @props.dataType?
      if (@props.dataType is @props.children.ref) then true else false
    else
      true

  render: ->
    classNames = ['header-cell', 'sortable', @props.className]
    if @props.sortState.key is @props.sortKey and @isSplitHeader()
      classNames.push if @props.sortState.asc then 'is-ascending' else 'is-descending'

    <div
      data-assignment-type={@props.type}
      onClick={@onClick}
      className={classNames.join(' ')}>
        {@props.children}
    </div>
