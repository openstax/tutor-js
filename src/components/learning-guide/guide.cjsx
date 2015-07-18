React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

Chapter     = require './chapter'
Section     = require './section'
ColorKey    = require './color-key'
ProgressBar = require './progress-bar'
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

  render: ->
    {courseId} = @props

    # if there are less than 4 sections, use 1/2 of the available ones
    weakStrongCount = Math.min(@props.allSections.length / 2, 4)

    <div className='guide-container'>

      <div className='guide-heading'>
        <span className='guide-group-title'>Current Level of Understanding</span>
        <Router.Link to='dashboard' params={{courseId}} className='btn btn-default header-button'>
          Return to Dashboard
        </Router.Link>
      </div>

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
                Weaker
              </div>
              <div>
                {for section, i in _.first(@props.allSections, weakStrongCount)
                  <Section key={i} section={section} {...@props} />}
              </div>
            </div>
            <div className="chapter-panel stronger">
              <div className='chapter-heading metric'>
                Stronger
              </div>
              <div>
                {for section, i in _.last(@props.allSections, weakStrongCount)
                  <Section key={i} section={section} {...@props} />}
              </div>
            </div>
          </BS.Col>
        </BS.Row>
      </div>


      <div className='guide-footer'>
        <div className='guide-key'>
          Click on the bar to practice the topic
        </div>
        <ColorKey />

      </div>

    </div>
