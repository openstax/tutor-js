React = require 'react'
classnames = require 'classnames'

Router = require '../router'

# Used to cancel router transitions the same way an onClick event is
class FakeEvent
  _isDefaultPrevented: false
  preventDefault: -> @_isDefaultPrevented = true
  isDefaultPrevented: ->  @_isDefaultPrevented

# Renders ONLY the list of tabs (not tab body), with @props.chilren inline with the tabs
# Usefull for rendering controls beside the Tabs

Tabs = React.createClass

  propTypes:
    onSelect: React.PropTypes.func.isRequired
    tabIndex: React.PropTypes.number
    initialActive: React.PropTypes.number
    params: React.PropTypes.object
    tabs: React.PropTypes.arrayOf(
      React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.element ])
    ).isRequired
    windowImpl: React.PropTypes.object

  getDefaultProps: ->
    windowImpl: window
    initialActive: 0

  contextTypes:
    router: React.PropTypes.object

  getInitialState: ->
    {tab} = Router.getQuery(@props.windowImpl)
    activeIndex: if _.isUndefined(tab) then @props.initialActive else parseInt(tab, 10)

  componentWillMount: ->
    # the router tab query param specified a different value than initialActive
    unless @state.activeIndex is @props.initialActive
      ev = new FakeEvent
      @props.onSelect(@state.activeIndex, ev)
      if ev.isDefaultPrevented()
        @selectTabIndex(@props.initialActive)

  # called when the router has transistioned, validate the new tabindex
  componentWillReceiveProps: (nextProps) ->
    {tab} = @props.params
    return if _.isUndefined(tab)

    activeIndex = parseInt(tab, 10)
    return if activeIndex is @state.activeIndex

    ev = new FakeEvent
    @props.onSelect(activeIndex, ev)
    if ev.isDefaultPrevented()
      @context.router.transitionTo(@context.router.getCurrentPathname(), {},
        {tab: @state.activeIndex})
    else
      @setState({activeIndex})

  # callable from the parent component via a ref
  selectTabIndex: (activeIndex) ->
    query = _.extend(Router.getQuery(@props.windowImpl), tab: activeIndex)
    @context.router.transitionTo(pathname: @props.windowImpl.location.pathname, query: query)
    @setState({activeIndex})

  onTabClick: (activeIndex, ev) ->
    @props.onSelect(activeIndex, ev)
    unless ev.isDefaultPrevented()
      @selectTabIndex(activeIndex)
    ev.preventDefault()

  renderTab: (tab, index) ->
    isSelected = index is @state.activeIndex

    <li key={index} tabIndex={index} className={classnames(active: isSelected)}>
      <a role="tab"
        href="#"
          tabIndex={if isSelected then -1 else 0}
        onClick={_.partial(@onTabClick, index)}
        aria-selected={'true' if isSelected}
      >
        {tab}
      </a>
    </li>

  render: ->
    <nav className={classnames('tutor-tabs', @props.className)}>
      <ul role="tablist" className="nav nav-tabs">
        {_.map @props.tabs, @renderTab}
      </ul>
      {@props.children}
    </nav>

module.exports = Tabs
