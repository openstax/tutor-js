React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

Chapter     = require './chapter'
Section     = require './section'
ColorKey    = require './color-key'
ProgressBar = require './progress-bar'
WeakerSections = require './weaker-sections'
PracticeButton = require '../learning-guide/practice-button'
ChapterSectionType = require './chapter-section-type'

module.exports = React.createClass
  displayName: 'LearningGuide'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:  React.PropTypes.string.isRequired
    allSections:  React.PropTypes.array.isRequired
    chapters: React.PropTypes.arrayOf(ChapterSectionType)
    heading:  React.PropTypes.element
    onPractice: React.PropTypes.func
    onReturn:   React.PropTypes.func.isRequired
    weakerTitle: React.PropTypes.string.isRequired
    weakerExplanation: React.PropTypes.element

  # renderWeaker: ->
  #   # sort sections by current level of understanding
  #   validSections = _.filter(@props.allSections, (s) -> s.clue.sample_size_interpretation isnt 'below')
  #   sortedSections = _.sortBy(validSections, (s) -> s.clue.value )

  #   # if there are less than 4 sections, use 1/2 of the available ones
  #   weakStrongCount = Math.min(sortedSections.length / 2, 4)

  #   <div className="chapter-panel weaker">
  #     <div className='chapter metric'>
  #       <span className='title'>{@props.weakerTitle}</span>
  #       {@props.weakerExplanation}
  #       {if @props.onPractice
  #         <PracticeButton title='Practice All' courseId={@props.courseId} /> }
  #     </div>
  #     <div className='sections'>
  #       {for section, i in _.first(sortedSections, weakStrongCount)
  #         <Section key={i} section={section} {...@props} />}
  #     </div>

  #   </div>

  render: ->
    {courseId} = @props

    noData = @props.allSections.length is 0

    <div className='guide-container'>

      {@props.heading}

      {@props.emptyMessage if noData}

      <div className='guide-group'>

        <WeakerSections {...@props} />

        <BS.Row>
          <h3>Individual Chapters</h3>
        </BS.Row>

        {for chapter, i in (@props.chapters or [])
          <Chapter chapter={chapter} {...@props} />}

      </div>


      <div className='guide-footer'>


      </div>

    </div>
