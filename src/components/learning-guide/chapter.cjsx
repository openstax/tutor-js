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

  getInitialState: ->
    expanded: false

  onToggle: (event) ->
    @setState(expanded: not @state.expanded)

  render: ->
    {chapter, courseId} = @props
    classes = ['chapter-panel']
    classes.push 'expanded' if @state.expanded
    <div className={classes.join(' ')}>
      <div className='view-toggle' onClick={@onToggle}>
        {if @state.expanded then 'View Less' else 'View More'}
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
