module.exports =

  # can modify which event you want to bind on as needed.
  _bindEvent: ->
    @bindEvent or @props.bindEvent or 'change'

  # @bindStore may need to be a function in some cases, i.e. when the store is being passed in as a prop.
  _bindStore: ->
    @bindStore?() or @bindStore

  _bindUpdate: (args...) ->
    if @bindUpdate?
      @bindUpdate.apply(@, args)
    else
      @setState({})

  _addListener: ->
    @boundEvent = @_bindEvent()

    @addBindListener?()
    bindStore = @_bindStore()
    bindStore.on(@boundEvent, @_bindUpdate) if @_bindStore?

  _removeListener: ->
    @removeBindListener?()
    bindStore = @_bindStore()
    bindStore.off(@boundEvent, @_bindUpdate) if @_bindStore?

  componentWillMount:   -> @_addListener()
  componentWillUnmount: -> @_removeListener()
