React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

ChapterSectionMixin = require '../chapter-section-mixin'

ChapterSectionType = require './chapter-section-type'
ProgressBar = require './progress-bar'
Section = require './section'

module.exports = React.createClass

  displayName: 'LearningGuideChapter'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    chapter:  ChapterSectionType.isRequired

  onToggle: (event) ->
    el = event.target.parentNode
    if el.classList.contains('expanded')
      el.classList.remove('expanded')
      event.target.innerHTML = 'View All'
    else
      el.classList.add('expanded')
      event.target.innerHTML = 'View Less'

  render: ->
    {chapter, courseId} = @props

    <div className="chapter-panel">
      <div className='view-toggle' onClick={@onToggle}>
        View All
      </div>
      <div className='chapter-heading'>
        <span className='chapter-number'>{chapter.chapter_section[0]}</span>
        <div className='chapter-title' title={chapter.title}>{chapter.title}</div>
        <Router.Link
          title="Click to Practice"
          to='viewPractice' params={{courseId}} query={page_ids: chapter.page_ids}
          className='btn btn-default progress-bar-button'>

          <ProgressBar level={chapter.current_level} />

        </Router.Link>
        <div className='amount-worked'>
          <span className='count'>{chapter.questions_answered_count} worked</span>
        </div>
      </div>
      <div>
        { for section, i in chapter.children
          <Section section={section} courseId={courseId} key={i} /> }
      </div>
    </div>
