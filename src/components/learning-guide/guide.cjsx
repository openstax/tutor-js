React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

Chapter     = require './chapter'
Section     = require './section'
ColorKey    = require './color-key'
ProgressBar = require './progress-bar'
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

  render: ->
    {courseId} = @props

    # sort sections by current level of understanding
    sortedSections = _.sortBy(@props.allSections, 'current_level')
    # if there are less than 4 sections, use 1/2 of the available ones
    weakStrongCount = Math.min(sortedSections.length / 2, 4)

    noData = @props.allSections.length is 0

    <div className='guide-container'>

      {@props.heading}

      {@props.emptyMessage if noData}

      <div className='guide-group'>

        <BS.Row>
          <BS.Col mdPush={0} xs={12} md={12}>
            <div className="chapter-panel">
              <div className='chapter-heading metric'>
                <span className='title'>{@props.weakerTitle}</span>
                {if @props.onPractice
                  <PracticeButton title='Practice All' courseId={@props.courseId} /> }
              </div>
              <div className='chapter-sections'>
                {for section, i in _.first(sortedSections, weakStrongCount)
                  <Section key={i} section={section} {...@props} />}
              </div>

            </div>
          </BS.Col>
        </BS.Row>

        <BS.Row>
          {for chapter, i in (@props.chapters or [])
            <BS.Col key={i} lg={12} md={12} sm={12} xs={12}>
              <Chapter chapter={chapter} {...@props} />
            </BS.Col>}
        </BS.Row>

      </div>


      <div className='guide-footer'>


      </div>

    </div>
