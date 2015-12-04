React = require 'react/addons'
classnames = require 'classnames'
api = require '../api'

interpolate = require 'interpolate'

Reactive = React.createClass
  displayName: 'Reactive'

  propTypes:
    children: React.PropTypes.node.isRequired
    store: React.PropTypes.object.isRequired
    topic: React.PropTypes.string.isRequired
    apiChannelPattern: React.PropTypes.string
    channelUpdatePattern: React.PropTypes.string
    apiChannelName: React.PropTypes.string
    fetcher: React.PropTypes.func
    filter: React.PropTypes.func
    getStatusMessage: React.PropTypes.func

  getDefaultProps: ->
    apiChannelPattern: '{apiChannelName}.{topic}.send.*'
    channelUpdatePattern: 'load.*'

  getInitialState: ->
    {channelUpdatePattern, apiChannelPattern} = @props

    state = @getState()
    state.status = 'loading'

    state.storeChannelUpdate = interpolate(channelUpdatePattern, @props)
    state.apiChannelSend = interpolate(apiChannelPattern, @props)

    state

  fetchModel: (props) ->
    props ?= @props
    {topic, store, fetcher} = props

    if _.isFunction(fetcher) then fetcher(props) else store.fetch(topic)

  getState: (eventData = {}, props) ->
    props ?= @props
    {topic, store} = props
    {status} = eventData
    status ?= 'loaded'

    errors = eventData?.data?.errors

    item: store.get?(topic)
    status: status
    errors: errors

  isForThisComponent: (eventData, props) ->
    props ?= @props
    {topic, filter} = props

    eventData.errors? or filter?(props, eventData) or eventData?.data?.id is topic or eventData?.data?.topic is topic

  update: (eventData, props) ->
    props ?= @props
    return unless @isForThisComponent(eventData, props)

    nextState = @getState(eventData, props)
    @setState(nextState)

  setStatus: (eventData) ->
    return unless @isForThisComponent(eventData)

    {status} = eventData
    @setState({status})

  componentWillMount: ->
    {store} = @props
    {storeChannelUpdate, apiChannelSend} = @state

    @fetchModel()
    store.channel.on(storeChannelUpdate, @update)
    api.channel.on(apiChannelSend, @setStatus)

  componentWillUnmount: ->
    {topic, store} = @props
    {storeChannelUpdate, apiChannelSend} = @state

    store.channel.off(storeChannelUpdate, @update)
    api.channel.off(apiChannelSend, @setStatus)

  componentWillReceiveProps: (nextProps) ->
    stubDataForImmediateUpdate =
      data:
        id: nextProps.topic
      status: 'cached'

    @update(stubDataForImmediateUpdate, nextProps)
    @fetchModel(nextProps) if nextProps.topic isnt @props.topic

  render: ->
    {status, item} = @state
    {className} = @props

    classes = classnames 'reactive', "reactive-#{status}", className,
      'is-empty': _.isEmpty(item)

    propsForChildren = _.pick(@state, 'status', 'item', 'errors')

    reactiveItems = React.Children.map(@props.children, (child) ->
      React.addons.cloneWithProps(child, propsForChildren)
    )

    <div className={classes}>
      {reactiveItems}
    </div>

module.exports = {Reactive}
