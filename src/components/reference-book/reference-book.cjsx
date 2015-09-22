React = require 'react'
_  = require 'underscore'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

NavBar = require './navbar'
Menu = require './slide-out-menu'
ChapterSectionMixin = require '../chapter-section-mixin'
PageShell = require './page-shell'
WindowResizeListenerMixin = require '../resize-listener-mixin'

# menu width (300) + page width (1000) + 50 px padding
# corresponds to @reference-book-page-width and @reference-book-menu-width in variables.less
MENU_VISIBLE_BREAKPOINT = 1350

module.exports = React.createClass
  displayName: 'ReferenceBook'

  mixins: [WindowResizeListenerMixin, ChapterSectionMixin]

  propTypes:
    navbarControls: React.PropTypes.element
    ecosystemId: React.PropTypes.string.isRequired
    dataProps:   React.PropTypes.object
    section:     React.PropTypes.string
    cnxId:       React.PropTypes.string
    className:   React.PropTypes.string
    contentComponent: React.PropTypes.func

  getDefaultProps: ->
    contentComponent: PageShell

  defaultStateFromProps: (props) ->
    section = props.section or @sectionFormat(ReferenceBookStore.getFirstSection(@props.ecosystemId))
    @setState
      section: section
      cnxId:   props.cnxId or
        ReferenceBookStore.getChapterSectionPage({ecosystemId:@props.ecosystemId, section:section}).cnx_id

  componentWillReceiveProps: (nextProps) ->
    @defaultStateFromProps(nextProps)

  componentWillMount: ->
    @defaultStateFromProps(@props)
    # if the screen is wide enought, start with menu open
    @setState(isMenuVisible: not @isMenuOnTop())

  isMenuOnTop: ->
    @state.windowEl.width < MENU_VISIBLE_BREAKPOINT

  onMenuClick: (ev) ->
    @toggleMenuState() if @isMenuOnTop()

  toggleMenuState: (ev) ->
    @setState(isMenuVisible: not @state.isMenuVisible)
    ev?.preventDefault() # needed to prevent scrolling to top

  render: ->
    classnames = ["reference-book"]
    classnames.push(@props.className) if @props.className
    classnames.push('menu-open') if @state.isMenuVisible

    <div {...@props.dataProps} className={classnames.join(' ')}>

      <NavBar
        ecosystemId={@props.ecosystemId}
        section={@state.section}
        toggleTocMenu={@toggleMenuState}
        isMenuVisible={@state.isMenuVisible}
        extraControls={@props.navbarControls}
      />

      <div className="content">

        <Menu
          ecosystemId={@props.ecosystemId}
          activeSection={@state.section}
          opened={@state.isMenuVisible}
          onMenuSelection={@onMenuClick}
        />

        <@props.contentComponent
          cnxId={@state.cnxId}
          section={@state.section}
          ecosystemId={@props.ecosystemId}
        />

      </div>
    </div>
