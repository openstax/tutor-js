React = require 'react'
_  = require 'underscore'
classnames = require 'classnames'
{SpyMode} = require 'openstax-react-components'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'

NavBar = require './navbar'
Menu = require './slide-out-menu'
ChapterSectionMixin = require '../chapter-section-mixin'
PageShell = require './page-shell'
WindowResizeListenerMixin = require '../resize-listener-mixin'
PageNavigation = require './page-navigation'

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
    menuRouterLinkTarget: React.PropTypes.string
    onSectionSelection: React.PropTypes.func

  getDefaultProps: ->
    contentComponent: PageShell

  defaultStateFromProps: (props) ->
    section = props.section or @sectionFormat(ReferenceBookStore.getFirstSection(@props.ecosystemId))
    @setState
      section: section
      ecosystemId: props.ecosystemId or @props.ecosystemId
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

  onMenuClick: (section, ev) ->
    @toggleMenuState() if @isMenuOnTop()
    @props.onSectionSelection?(section, ev)

  toggleMenuState: (ev) ->
    @setState(isMenuVisible: not @state.isMenuVisible)
    ev?.preventDefault() # needed to prevent scrolling to top

  render: ->
    className = classnames 'reference-book', @props.className,
      'menu-open': @state.isMenuVisible

    pageInfo = ReferenceBookStore.getPageInfo(@state)

    nav = _.defaults({}, @props.navigation, {
      next: !!pageInfo.next, prev: !!pageInfo.prev
    })

    <div {...@props.dataProps} className={className}>
      <SpyMode.Wrapper>
        <NavBar
          ecosystemId={@props.ecosystemId}
          section={@state.section}
          toggleTocMenu={@toggleMenuState}
          isMenuVisible={@state.isMenuVisible}
          extraControls={@props.navbarControls}
        />

        <div className="content">

          <Menu
            {...@props}
            ecosystemId={@props.ecosystemId}
            activeSection={@state.section}
            onMenuSelection={@onMenuClick}
          />

          <PageNavigation direction='prev' {...@props} enabled={nav.prev}
            section={@sectionFormat(pageInfo.prev?.chapter_section)} />

          <@props.contentComponent
            cnxId={@state.cnxId}
            section={@state.section}
            ecosystemId={@props.ecosystemId}
          />

          <PageNavigation direction='next' {...@props} enabled={nav.next}
            section={@sectionFormat(pageInfo.next?.chapter_section)} />
        </div>

      </SpyMode.Wrapper>
    </div>
