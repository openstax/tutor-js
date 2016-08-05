React = require 'react'
_ = require 'underscore'
cn = require 'classnames'
classnames = require 'classnames'
Pagination = require('ultimate-pagination')

{ResizeListenerMixin, ScrollToMixin} = require 'shared'

Sectionizer = React.createClass

  mixins: [ScrollToMixin, ResizeListenerMixin]

  propTypes:
    chapter_sections:  React.PropTypes.array.isRequired
    onScreenElements:  React.PropTypes.array.isRequired
    nonAvailableWidth: React.PropTypes.number.isRequired
    getCurrentSection: React.PropTypes.func
    onSectionClick:    React.PropTypes.func

  getInitialState: ->
    scrollingTo: _.first(@props.chapter_sections)
    renderCount: 5 # a decent default


  _resizeListener: (sizes) ->
    @calculateAvailableSpace(sizes.windowEl)

  calculateAvailableSpace: (size) ->
    @setState(renderCount: ((Math.floor( size.width - @props.nonAvailableWidth) / 42) - 2))

  # the below properties are read by the ScrollTo mixin
  scrollingTargetDOM: -> window.document
  getScrollTopOffset: -> 160 # 70px high control bar and a bit of padding

  componentDidMount: ->
    @calculateAvailableSpace(@state.windowEl or @_getWindowSize())
    @scrollToSelector(".questions-list")

  selectSection: (section) ->
    if @props.onSectionClick
      @props.onSectionClick(section)
     else
       @scrollToSelector("[data-section='#{section}']")

  currentSection: ->
    @props.currentSection or _.first(@props.onScreenElements)

  scrollIndex: ->
    @props.chapter_sections.indexOf(@currentSection())

  goBack: ->
    index = @scrollIndex()
    sections = @props.chapter_sections
    @selectSection(sections[ if index > 1 then index - 1 else 0])

  goNext: ->
    index = @scrollIndex()
    sections = @props.chapter_sections
    @selectSection(
      sections[ if index < sections.length then index + 1 else sections.length - 1]
    )

  renderLink: (cs, active) ->
    <div key={cs} onClick={_.partial(@selectSection, cs)}
      className={classnames('section', {active: active})}
    >{cs}</div>

  renderEllipsis: (cs) ->
    <div key={cs} onClick={_.partial(@selectSection, cs)} className='section ellipsis'>…</div>

  renderCurrentLinks: ->
    sections = @props.chapter_sections
    active = @currentSection()
    currentPage = _.findIndex(sections, (section) -> section is active )
    links = []
    if sections.length > @state.renderCount
      pages = Pagination.getPaginationModel({currentPage: currentPage + 1, totalPages: sections.length})
      for page, i in pages
        if page.type is Pagination.ITEM_TYPES.PAGE
          links.push( @renderLink( sections[page.value - 1], page.isActive ) )
        else if page.type is Pagination.ITEM_TYPES.ELLIPSIS
          links.push( @renderEllipsis( sections[page.value - 1] ) )
    else
      pagination = []
      for section, i in sections
        links.push( @renderLink( section, i is currentPage) )

    links

  render: ->

    <div className="sectionizer">
      <div
        className={cn('prev', disabled: 0 is @scrollIndex())}
        onClick={@goBack}>❮❮</div>
      {@renderCurrentLinks()}
      <div className="next"
        className={cn('next', disabled: @props.chapter_sections.length - 1 is @scrollIndex())}
        onClick={@goNext}>❯❯</div>
    </div>


module.exports = Sectionizer
