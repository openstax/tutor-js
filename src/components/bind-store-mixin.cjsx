module.exports =

  # @bindStore may need to be a function in some cases, i.e. when the store is being passed in as a prop.
  _bindStore: ->
    @bindStore?() or @bindStore

  _bindUpdate: (args...) ->
    if @bindUpdate?
      @bindUpdate.apply(@, args)
    else
      @setState({})

  _addListener: ->
    bindStore = @_bindStore()
    bindStore.addChangeListener(@_bindUpdate) if @_bindStore?

  _removeListener: ->
    bindStore = @_bindStore()
    bindStore.removeChangeListener(@_bindUpdate) if @_bindStore?

  componentWillMount:   -> @_addListener()
  componentDidUpdate:   -> @_addListener()

  # The following fixs an invariant violation when switching screens
  componentWillUnmount: -> @_removeListener()
  componentWillUpdate:  -> @_removeListener()
