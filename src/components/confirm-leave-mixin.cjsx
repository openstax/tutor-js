$ = require 'jquery'

module.exports =
  # getFlux: -> {store, actions}
  # getId: -> id 
  componentDidMount: ->
    $(window).on("beforeunload", @confirmLeave)

  confirmLeave: ->
    {store} = @getFlux()
    if store.isChanged(@getId())
      return "You have unsaved changes.  Are you sure you want to leave?"
