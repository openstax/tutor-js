React    = require 'react'
_ = require 'underscore'

{ChapterSectionMixin} = require 'shared'

{StepTitleStore} = require '../flux/step-title'

RelatedContent = React.createClass

  propTypes:
    contentId: React.PropTypes.string.isRequired
    title: React.PropTypes.string.isRequired
    hasLearningObjectives: React.PropTypes.bool
    chapter_section: React.PropTypes.oneOfType([
      React.PropTypes.array
      React.PropTypes.string
    ]).isRequired

  mixins: [ChapterSectionMixin]

  isIntro: ->
    (_.isArray(@props.chapter_section) and
      (@props.chapter_section.length is 1 or
      @props.chapter_section[1] is 0)) or
      (_.isString(@props.chapter_section) and
      @props.chapter_section.indexOf('.') is -1)

  render: ->
    {title, contentId, chapter_section} = @props

    return null if _.isEmpty(title) or @isIntro()

    section = @sectionFormat(chapter_section)

    unless hasLearningObjectives?
      hasLearningObjectives = StepTitleStore.hasLearningObjectives(contentId)

    <h4
      className='related-content'
      data-has-learning-objectives={hasLearningObjectives}
    >
      <span className="part">
        <span className="section">{section} </span>
        <span className="title">{title}</span>
      </span>
    </h4>

module.exports = RelatedContent
