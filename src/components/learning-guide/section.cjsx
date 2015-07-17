React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
ChapterSectionMixin = require '../chapter-section-mixin'
ProgressBar = require './progress-bar'
ChapterSectionType = require './chapter-section-type'

module.exports = React.createClass

  displayName: 'LearningGuideSection'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    section:  ChapterSectionType.isRequired

  mixins: [ChapterSectionMixin]

  render: ->
    {courseId, section} = @props

    queryParams = {page_ids: section.page_ids}

    <div className='section'>
      <div className='section-heading'>
        <span className='section-number'>
          {@sectionFormat(section.chapter_section)}
        </span>
        <span className='section-title' title={section.title}>{section.title}</span>
      </div>
      <Router.Link
      to='viewPractice'
      params={{courseId}}
      query={queryParams}
      title="Click to Practice"
      className='btn btn-default progress-bar-button'>
        <ProgressBar level={section.current_level} />
      </Router.Link>
      <div className='amount-worked'>
        <span className='count'>{section.questions_answered_count} worked</span>
      </div>
    </div>
