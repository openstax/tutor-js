$ = require 'jquery'

module.exports =
  # getFlux: -> {store, actions}
  # getId: -> id 
  componentDidMount: ->
    $(window).on("beforeunload", @confirmLeave)
  componentWillUnmount: ->
    $(window).off("beforeunload", @confirmLeave)

    {store, actions} = @getFlux()
    # TODO add isValid() to the CrudConfig so we can save
    if store.isChanged(@getId())
      alert 'Your changes will be lost because you did not save.  Come back soon!'

  confirmLeave: ->
    {store} = @getFlux()
    if store.isChanged(@getId())
      return "You have unsaved changes.  Are you sure you want to leave?"
