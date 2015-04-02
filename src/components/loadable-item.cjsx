React = require 'react'

# This component is useful for viewing a single Object from the Backend (ie Task, TaskPlan).
# It uses methods defined in `CrudConfig` (maybe that should be renamed) to:
#
# - display "Loading...", "Error", or the actual rendered component
# - automatically listens to changes in the appropriate store to re-render
# - calls `load` to fetch the latest version of the component when initially mounted

module.exports = React.createClass
  propTypes:
    id: React.PropTypes.string.isRequired
    store: React.PropTypes.object.isRequired
    actions: React.PropTypes.object.isRequired
    renderItem: React.PropTypes.func.isRequired
    update: React.PropTypes.func

  componentWillMount: ->
    {store} = @props
    store.addChangeListener(@_update)
  componentWillUnmount: ->
    {store} = @props
    store.removeChangeListener(@_update)

  _update: -> @update?() or @setState({})

  render: ->
    {id, store, actions, renderItem} = @props

    if store.isUnknown(id)
      # The load is done here because otherwise it would need to be in `componentWillMount`
      # **and** componentWillUpdate(nextProps) making the API a bit more clunky
      # since `@getId()` would need to take an optional `nextProps`.
      unless store.isNew(id)
        actions.load(id)
      <div className="-loading">Loading Started...</div>
    else if store.isLoading(id)
      <div className="-loading">Loading...</div>
    else if store.isLoaded(id)
      renderItem() # TODO: send id as arg maybe
    else
      <div className="-error">Error Loading</div>
