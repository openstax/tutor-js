_ = require 'underscore'
React = require 'react'
classnames = require 'classnames'
keymaster = require 'keymaster'
Icon = require './icon'
Arrow = require './icons/arrow'

KEYBINDING_SCOPE  = 'page-navigation'

PageNavigation = React.createClass

  propTypes:
    className: React.PropTypes.string
    onForwardNavigation:  React.PropTypes.func.isRequired
    onBackwardNavigation: React.PropTypes.func.isRequired
    isForwardEnabled:     React.PropTypes.bool.isRequired
    isBackwardEnabled:    React.PropTypes.bool.isRequired
    forwardHref:          React.PropTypes.string
    backwardHref:         React.PropTypes.string
    enableKeys:           React.PropTypes.bool

  getDefaultProps: ->
    enableKeys: true
    forwardHref: '#'
    backwardHref: '#'

  getInitialState: ->
    activeNav: null

  componentWillMount: ->
    @enableKeys() if @props.enableKeys

  enableKeys: ->
    keymaster('left',  KEYBINDING_SCOPE, @keyOnPrev)
    keymaster('right', KEYBINDING_SCOPE, @keyOnNext)
    keymaster.setScope(KEYBINDING_SCOPE)

  disableKeys: ->
    keymaster.deleteScope(KEYBINDING_SCOPE)

  componentWillReceiveProps: (nextProps) ->
    if nextProps.enableKeys and not @props.enableKeys
      @enableKeys()
    else if not nextProps.enableKeys and @props.enableKeys
      @disableKeys()

  componentWillUnmount: ->
    @disableKeys()

  toggleNavHighlight: (type) ->
    @setState(activeNav: type)
    _.delay =>
      @setState(activeNav: null)
    , 300

  keyOnPrev: ->
    return unless @props.isBackwardEnabled
    @toggleNavHighlight('prev')
    @props.onBackwardNavigation(@props.backwardHref)

  keyOnNext: ->
    return unless @props.isForwardEnabled
    @toggleNavHighlight('next')
    @props.onForwardNavigation(@props.forwardHref)


  clickHandler: (action, href, ev) ->
    ev.preventDefault()
    action?(href)
    window.scrollTo(0,0);

  renderPrev: ->
    cb = if @props.isBackwardEnabled then @props.onBackwardNavigation else null
    <a href={@props.backwardHref} target="_blank"
      aria-label="Go Backward"
      tabIndex={if @props.isBackwardEnabled then 0 else -1}
      disabled={not cb?}
      onClick={_.partial(@clickHandler, cb, @props.backwardHref)}
      className={classnames('paging-control', 'prev', active: @state.activeNav is 'prev')}
    >
      <div className="arrow-wrapper">
        <Arrow direction="left" />
      </div>
    </a>

  renderNext: ->
    cb = if @props.isForwardEnabled then @props.onForwardNavigation else null
    <a href={@props.forwardHref}
      tabIndex={if @props.isForwardEnabled then 0 else -1}
      aria-label="Go Forward"
      disabled={not cb?}
      onClick={_.partial(@clickHandler, cb, @props.forwardHref)}
      className={classnames('paging-control', 'next', active: @state.activeNav is 'next')}
    >
      <div className="arrow-wrapper">
        <Arrow direction="right" />
      </div>
    </a>

  render: ->
    <div className={classnames('tutor-paging-navigation', @props.className)}>
      {@renderPrev()}
      <div className="paged-content" tabIndex="0">
        {@props.children}
      </div>
      {@renderNext()}
    </div>


module.exports = PageNavigation
