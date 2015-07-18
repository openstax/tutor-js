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
    onPractice: React.PropTypes.func

  getDefaultProps: ->
    defaultExpanded: false

  onToggle: (event) ->
    @setState(expanded: not @state.expanded)

  # The CollapsibleMixin is used to hide/show the sections
  mixins: [BS.CollapsibleMixin]
  getCollapsibleDOMNode: -> React.findDOMNode(@refs.sections)
  getCollapsibleDimensionValue: -> React.findDOMNode(@refs.sections).scrollHeight

  render: ->
    {chapter, courseId} = @props
    classes = ['chapter-panel']
    classes.push if @isExpanded() then 'expanded' else 'collapsed'

    <div className={classes.join(' ')}>
      <div className='view-toggle' onClick={@onToggle}>
        {if @state.expanded then 'View Less' else 'View More'}
      </div>
      <div className='chapter-heading'>
        <span className='chapter-number'>{chapter.chapter_section[0]}</span>
        <div className='chapter-title' title={chapter.title}>{chapter.title}</div>

        <ProgressBar {...@props} section={chapter} />

        <div className='amount-worked'>
          <span className='count'>{chapter.questions_answered_count} worked</span>
        </div>
      </div>
      <div ref='sections' className='sections'>
        { for section, i in chapter.children
          <Section  key={i} section={section} {...@props} /> }
      </div>
    </div>
