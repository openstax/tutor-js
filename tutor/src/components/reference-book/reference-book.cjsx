React = require 'react'
_  = require 'underscore'
classnames = require 'classnames'
{SpyMode} = require 'shared'

{ReferenceBookActions, ReferenceBookStore} = require '../../flux/reference-book'
CourseData = require '../../helpers/course-data'
NavBar = require './navbar'
Menu = require './slide-out-menu'
{ResizeListenerMixin, ChapterSectionMixin} = require 'shared'
PageShell = require './page-shell'
ReferenceViewPageNavigation = require './page-navigation'

# menu width (300) + page width (1000) + 50 px padding
# corresponds to @reference-book-page-width and @reference-book-menu-width in variables.less
MENU_VISIBLE_BREAKPOINT = 1350

module.exports = React.createClass
  displayName: 'ReferenceBook'

  mixins: [ResizeListenerMixin, ChapterSectionMixin]

  propTypes:
    navbarControls: React.PropTypes.element
    courseId: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired
    dataProps:   React.PropTypes.object
    section:     React.PropTypes.string
    cnxId:       React.PropTypes.string
    className:   React.PropTypes.string
    contentComponent: React.PropTypes.func
    menuRouterLinkTarget: React.PropTypes.string
    onSectionSelection: React.PropTypes.func
    pageNavRouterLinkTarget: React.PropTypes.string.isRequired

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

    pageProps =
      cnxId: @state.cnxId
      section: @state.section
      ecosystemId: @props.ecosystemId
      dataProps: @props.dataProps

    <div {...@props.dataProps} className={className}>

      <SpyMode.Wrapper>

        <NavBar
          ecosystemId={@props.ecosystemId}
          courseId={@props.courseId}
          section={@state.section}
          toggleTocMenu={@toggleMenuState}
          isMenuVisible={@state.isMenuVisible}
          extraControls={@props.navbarControls}
        />

        <div className="content">

          <Menu
            {...@props}
            isOpen={@state.isMenuVisible}
            ecosystemId={@props.ecosystemId}
            activeSection={@state.section}
            onMenuSelection={@onMenuClick}
          />

          <ReferenceViewPageNavigation
            {...pageProps}
            pageNavRouterLinkTarget={@props.pageNavRouterLinkTarget}
          >
            <@props.contentComponent {...pageProps} />
          </ReferenceViewPageNavigation>

        </div>

      </SpyMode.Wrapper>
    </div>
