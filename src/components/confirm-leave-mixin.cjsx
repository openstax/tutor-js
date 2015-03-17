$ = require 'jquery'

module.exports =
  # getFlux: -> {store, actions}
  # getId: -> id 
  componentDidMount: ->
    window.addEventListener 'beforeunload', @confirmLeave
  componentWillUnmount: ->
    window.removeEventListener "beforeunload", @confirmLeave

    {store, actions} = @getFlux()
    # TODO add isValid() to the CrudConfig so we can save
    if store.isChanged(@getId())
      alert 'Your changes will be lost because you did not save.  Come back soon!'

  confirmLeave: (e) ->
    {store} = @getFlux()
    if store.isChanged(@getId())
      msg = "You have unsaved changes.  Are you sure you want to leave?"
      (e or window.event).returnValue = msg     # Gecko and Trident
      msg                                        # Gecko and WebKit
