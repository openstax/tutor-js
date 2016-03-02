React = require 'react'
cn = require 'classnames'
ScrollTo = require '../scroll-to-mixin'

Sectionizer = React.createClass

  mixins: [ScrollTo]

  propTypes:
    chapter_sections: React.PropTypes.array

  getInitialState: ->
    {scrollingTo: _.first(@props.chapter_sections)}

  scrollingTargetDOM: -> window.document

  componentWillMount: ->
    @setState(scrollPosition: @props.exerciseGroups)

  componentDidMount: ->
    @scrollToSelector(".questions-list")

  onAfterScroll: ->
    @setState({scrollingTo: null, scrollPosition: @state.scrollingTo})

  getScrollTopOffset: -> 120 # 70px high control bar and 50px spacing for label

  scrollToSection: (section) ->
    @setState({scrollingTo: section})
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
      {for cs in @props.chapter_sections
        <div key={cs}
          onClick={_.partial(@scrollToSection, cs)}
          className={'active' if @state.scrollPosition is cs}
        >{cs}</div>}
      <div className="next"
        className={cn('next', disabled: @props.chapter_sections.length - 1 is @scrollIndex())}
        onClick={@goNext}>❯</div>
    </div>


module.exports = Sectionizer
