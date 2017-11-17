React = require 'react'

{TaskStepStore} = require '../../flux/task-step'
{TaskPanelStore} = require '../../flux/task-panel'
{ArbitraryHtmlAndMath, ChapterSectionMixin} = require 'shared'
CourseData = require '../../helpers/course-data'
{BookContentMixin, LinkContentMixin} = require '../book-content-mixin'
RelatedContent = require '../related-content'
Router = require '../../helpers/router'
{default: AnnotationWidget} = require '../annotations/annotation'
Icon = require '../icon'

# TODO: will combine with below, after BookContentMixin clean up
ReadingStepContent = React.createClass
  displayName: 'ReadingStepContent'

  propTypes:
    id: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    stepType: React.PropTypes.string.isRequired

  mixins: [BookContentMixin, ChapterSectionMixin]
  # used by BookContentMixin
  getSplashTitle: ->
    TaskStepStore.get(@props.id)?.title or ''
  getCnxId: ->
    TaskStepStore.getCnxId(@props.id)

  shouldExcludeFrame: ->
    @props.stepType is 'interactive'

  renderNextStepLink: ->
    return null unless @props.nextStepTitle
    <div className="continue-to-next-task-step">
      <a onClick={@props.onContinue}>
        Continue to “<span className="next-step-title">
          {@props.nextStepTitle}
        </span>” <Icon type="chevron-right" />
      </a>
    </div>

  shouldOpenNewTab: -> true
  render: ->
    {id, stepType} = @props

    {content_html, related_content} = TaskStepStore.get(id)
    {courseId} = Router.currentParams()

    <div className="#{stepType}-step">
      <div className="#{stepType}-content" {...CourseData.getCourseDataProps(courseId)}>

        <RelatedContent contentId={id} {...related_content?[0]} />
        <ArbitraryHtmlAndMath
          className='book-content'
          shouldExcludeFrame={@shouldExcludeFrame}
          html={content_html}
        />
        {@renderNextStepLink()}
      </div>
      <AnnotationWidget pageType={stepType} documentId={this.getCnxId()} />
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
        shouldExcludeFrame={@shouldExcludeFrame}
      />
    </div>


module.exports = {StepContent, ReadingStepContent}
