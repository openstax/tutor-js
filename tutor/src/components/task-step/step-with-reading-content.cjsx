React = require 'react'

{TaskStepStore} = require '../../flux/task-step'
{ArbitraryHtmlAndMath, ChapterSectionMixin} = require 'shared'
{BookContentMixin, LinkContentMixin} = require '../book-content-mixin'
RelatedContentLink = require '../related-content-link'

# TODO: will combine with below, after BookContentMixin clean up
ReadingStepContent = React.createClass
  displayName: 'ReadingStepContent'

  propTypes:
    id: React.PropTypes.string.isRequired
    courseDataProps: React.PropTypes.object.isRequired
    stepType: React.PropTypes.string.isRequired

  mixins: [BookContentMixin, ChapterSectionMixin]
  # used by BookContentMixin
  getSplashTitle: ->
    TaskStepStore.get(@props.id)?.title or ''
  getCnxId: ->
    TaskStepStore.getCnxId(@props.id)

  shouldExcludeFrame: ->
    @props.stepType is 'interactive'

  shouldOpenNewTab: -> true
  render: ->
    {id, courseDataProps, stepType} = @props
    {content_html, related_content} = TaskStepStore.get(id)
    {courseId} = @context.router.getCurrentParams()

    <div className="#{stepType}-step">
      <ArbitraryHtmlAndMath
        {...courseDataProps}
        className="#{stepType}-content"
        shouldExcludeFrame={@shouldExcludeFrame}
        html={content_html} />
      <RelatedContentLink courseId={courseId} content={related_content} />
    </div>

StepContent = React.createClass
  displayName: 'StepContent'

  propTypes:
    id: React.PropTypes.string.isRequired
    stepType: React.PropTypes.string.isRequired

  mixins: [LinkContentMixin]
  # used by LinkContentMixin
  getCnxId: ->
    TaskStepStore.getCnxId(@props.id)

  render: ->
    {id, stepType} = @props
    {content_html} = TaskStepStore.get(id)
    <div className={"#{stepType}-step"}>
      <ArbitraryHtmlAndMath
        className={"#{stepType}-content"}
        html={content_html}
        shouldExcludeFrame={@shouldExcludeFrame} />
    </div>


module.exports = {StepContent, ReadingStepContent}
