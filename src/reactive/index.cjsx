React = require 'react/addons'
classnames = require 'classnames'
api = require '../api'

Reactive = React.createClass
  displayName: 'Reactive'

  propTypes:
    children: React.PropTypes.node.isRequired
    channelName: React.PropTypes.string.isRequired
    store: React.PropTypes.object.isRequired
    id: React.PropTypes.string.isRequired
    getStatusMessage: React.PropTypes.func

  getInitialState: ->
    @getState()

  getState: (eventData = {}) ->
    {id, store} = @props
    {status} = eventData
    status ?= 'loaded'

    item: store.get(id)
    status: status

  isForThisComponent: (eventData) ->
    {id} = @props
    eventData.data.id is id

  update: (eventData) ->
    return unless @isForThisComponent(eventData)
    
    nextState = @getState(eventData)
    @setState(nextState)

  setStatus: (eventData) ->
    return unless @isForThisComponent(eventData)

    {status} = eventData
    @setState({status})

  componentWillMount: ->
    {id, store, channelName} = @props

    store.fetch(id)
    store.channel.on("load.*", @update)
    api.channel.on("#{channelName}.*.send.*", @setStatus)

  componentWillUnmount: ->
    {id, store, channelName} = @props

    store.channel.off("load.*", @update)
    api.channel.off("#{channelName}.*.send.*", @setStatus)

  componentWillReceiveProps: (nextProps) ->
    {id, store} = @props
    store.fetch(nextProps.id)

  render: ->
    {status, item} = @state
    {id, className} = @props

    classes = classnames "reactive-#{status}", className

    propsForChildren = _.clone(@state)
    propsForChildren.id = id

    reactiveItems = React.Children.map(@props.children, (child) ->
      React.addons.cloneWithProps(child, propsForChildren)
    )

    <div className={classes}>
      {reactiveItems}
    </div>

module.exports = {Reactive}
