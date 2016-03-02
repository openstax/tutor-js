React = require 'react'
cn = require 'classnames'
ScrollTo = require '../scroll-to-mixin'

Sectionizer = React.createClass

  mixins: [ScrollTo]

  propTypes:
    chapter_sections: React.PropTypes.array.isRequired
    onScreenElements: React.PropTypes.array.isRequired

  getInitialState: ->
    {scrollingTo: _.first(@props.chapter_sections)}

  # the below properties are read by the ScrollTo mixin
  scrollingTargetDOM: -> window.document
  getScrollTopOffset: -> 140 # 70px high control bar and 50px spacing for label

  componentDidMount: ->
    @scrollToSelector(".questions-list")

  scrollToSection: (section) ->
    @scrollToSelector("[data-section='#{section}']")

  scrollIndex: ->
    @props.chapter_sections.indexOf(@props.chapter_sections)

  goBack: ->
    index = @scrollIndex()
    @scrollToSection(sections[ if index > 1 then index - 1 else 0])

  goNext: ->
    index = @scrollIndex()
    @scrollToSection(
      sections[ if index < sections.length then index + 1 else sections.length - 1]
    )

  render: ->
    <div className="sectionizer">
      <div
        className={cn('prev', disabled: 0 is @scrollIndex())}
        onClick={@goBack}>❮</div>
      {for cs in @props.chapter_sections.sort()
        <div key={cs}
          onClick={_.partial(@scrollToSection, cs)}
          className={'active' if cs is _.first(@props.onScreenElements)}
        >{cs}</div>}
      <div className="next"
        className={cn('next', disabled: @props.chapter_sections.length - 1 is @scrollIndex())}
        onClick={@goNext}>❯</div>
    </div>


module.exports = Sectionizer
