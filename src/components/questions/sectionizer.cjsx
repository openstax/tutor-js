React = require 'react'
cn = require 'classnames'
ScrollTo = require '../scroll-to-mixin'

Sectionizer = React.createClass

  mixins: [ScrollTo]

  propTypes:
    chapter_sections:  React.PropTypes.array.isRequired
    onScreenElements:  React.PropTypes.array.isRequired
    getCurrentSection: React.PropTypes.func
    onSectionClick:    React.PropTypes.func

  getInitialState: ->
    {scrollingTo: _.first(@props.chapter_sections)}

  # the below properties are read by the ScrollTo mixin
  scrollingTargetDOM: -> window.document
  getScrollTopOffset: -> 80 # 70px high control bar and a bit of padding

  componentDidMount: ->
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

  render: ->
    <div className="sectionizer">
      <div
        className={cn('prev', disabled: 0 is @scrollIndex())}
        onClick={@goBack}>❮</div>
      {for cs in @props.chapter_sections.sort()
        <div key={cs}
          onClick={_.partial(@selectSection, cs)}
          className={'active' if cs is @currentSection()}
        >{cs}</div>}
      <div className="next"
        className={cn('next', disabled: @props.chapter_sections.length - 1 is @scrollIndex())}
        onClick={@goNext}>❯</div>
    </div>


module.exports = Sectionizer
