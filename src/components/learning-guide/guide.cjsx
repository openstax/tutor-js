React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

Chapter     = require './chapter'
Section     = require './section'
ColorKey    = require './color-key'
ProgressBar = require './progress-bar'
PracticeByTypeButton = require '../learning-guide/practice-by-type-button'
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


  showPracticeButton: (type, title) ->
    <PracticeByTypeButton 
    practiceType={type}
    practiceTitle={title}
    courseId={@props.courseId} />

  render: ->
    {courseId} = @props

    # sort sections by current level of understanding
    sortedSections = _.sortBy(@props.allSections, 'current_level')
    # if there are less than 4 sections, use 1/2 of the available ones
    weakStrongCount = Math.min(sortedSections.length / 2, 4)

    <div className='guide-container'>

      {@props.heading}

      <div className='guide-group'>
        <BS.Row>
          <BS.Col mdPull={0} xs={12} md={9}>
              {for chapter, i in @props.chapters
                <BS.Col key={i} lg={4} md={4} sm={6} xs={12}>
                  <Chapter chapter={chapter} {...@props} />
                </BS.Col>}
          </BS.Col>
          <BS.Col mdPush={0} xs={12} md={3}>
            <div className="chapter-panel weaker">
              <div className='chapter-heading metric'>
                <span className='arrow weaker'></span>Weaker
              </div>
              <div>
                {for section, i in _.first(sortedSections, weakStrongCount)
                  <Section key={i} section={section} {...@props} />}
              </div>
                {@showPracticeButton('weaker', 'Practice Weaker') if @props.onPractice}
            </div>
            <div className="chapter-panel stronger">
              <div className='chapter-heading metric'>
                <span className='arrow stronger'></span>Stronger
              </div>
              <div>
                {for section, i in _.last(sortedSections, weakStrongCount)
                  <Section key={i} section={section} {...@props} />}
              </div>
                {@showPracticeButton('stronger', 'Practice Stronger') if @props.onPractice}
            </div>
          </BS.Col>
        </BS.Row>
      </div>


      <div className='guide-footer'>
        <div className='guide-key'>
          {'Click on the bar to practice the topic' if @props.onPractice}
        </div>
        <ColorKey />

      </div>

    </div>
