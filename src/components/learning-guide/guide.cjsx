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
          <BS.Col mdPull={0} xs={12} md={9}>
              {for chapter, i in (@props.chapters or [])
                <BS.Col key={i} lg={4} md={4} sm={6} xs={12}>
                  <Chapter chapter={chapter} {...@props} />
                </BS.Col>}
          </BS.Col>
          <BS.Col mdPush={0} xs={12} md={3}>
            <div className="chapter-panel weaker">
              <div className='chapter-heading metric'>
                {@props.weakerTitle}
              </div>
              <div>
                {for section, i in _.first(sortedSections, weakStrongCount)
                  <Section key={i} section={section} {...@props} />}
              </div>
                {if @props.onPractice
                  <PracticeButton title='Practice Weaker' courseId={@props.courseId} /> }
            </div>
          </BS.Col>
        </BS.Row>
      </div>


      <div className='guide-footer'>
        

      </div>

    </div>
