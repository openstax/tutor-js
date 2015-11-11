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
    fetcher: React.PropTypes.func
    filter: React.PropTypes.func
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
    {filter} = @props
    return unless filter?(@props, eventData) or @isForThisComponent(eventData)
    
    nextState = @getState(eventData)
    @setState(nextState)

  setStatus: (eventData) ->
    {filter} = @props
    return unless filter?(@props, eventData) or @isForThisComponent(eventData)

    {status} = eventData
    @setState({status})

  componentWillMount: ->
    {id, store, channelName, fetcher} = @props
    fetcher?(@props) or store.fetch(id)
    store.channel.on("load.*", @update)
    api.channel.on("#{channelName}.*.send.*", @setStatus)

  componentWillUnmount: ->
    {id, store, channelName} = @props

    store.channel.off("load.*", @update)
    api.channel.off("#{channelName}.*.send.*", @setStatus)

  componentWillReceiveProps: (nextProps) ->
    {id, store, fetcher} = @props
    fetcher?(nextProps) or store.fetch(nextProps.id)

  render: ->
    {status, item} = @state
    {className} = @props

    classes = classnames "reactive-#{status}", className

    propsForChildren = _.clone(@state)

    reactiveItems = React.Children.map(@props.children, (child) ->
      React.addons.cloneWithProps(child, propsForChildren)
    )

    <div className={classes}>
      {reactiveItems}
    </div>

module.exports = {Reactive}
