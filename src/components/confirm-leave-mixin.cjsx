$ = require 'jquery'

module.exports =
  # getFlux: -> {store, actions}
  # getId: -> id 
  componentDidMount: ->
    $(window).on("beforeunload", @confirmLeave)
  componentWillUnmount: ->
    $(window).off("beforeunload", @confirmLeave)

    {store, actions} = @getFlux()
    if store.isChanged(@getId())
      if confirm('You have unsaved changes.  Would you like to save before you leave?')
        actions.save(@getId())

  confirmLeave: ->
    {store} = @getFlux()
    if store.isChanged(@getId())
      return "You have unsaved changes.  Are you sure you want to leave?"
