React = require 'react'
classnames = require 'classnames'


# Renders ONLY the list of tabs (not tab body), with @props.chilren inline with the tabs
# Usefull for rendering controls beside the Tabs

TabsWithChildren = React.createClass


  propTypes:
    onClick: React.PropTypes.func.isRequired
    tabs: React.PropTypes.arrayOf(
      React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.element ])
    ).isRequired

  getInitialState: ->
    tabIndex: 0

  onTabClick: (tabIndex, ev) ->
    ev.preventDefault()
    @setState({tabIndex})
    @props.onClick(ev, tabIndex)

  renderTab: (tab, index) ->
    isSelected = index is @state.tabIndex
    <li key={index} tabIndex={index} className={classnames(active: isSelected)}>
      <a role="tab"
        href="" tabIndex="-1" onClick={_.partial(@onTabClick, index)}
        aria-selected={'true' if isSelected}
      >
        {tab}
      </a>
    </li>

  render: ->
    <ul role="tablist"
      className={classnames('nav', 'nav-tabs', @props.className)}>
      {_.map @props.tabs, @renderTab}
      {@props.children}
    </ul>


module.exports = TabsWithChildren
