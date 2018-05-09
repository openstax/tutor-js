React = require 'react'
{Button} = require 'react-bootstrap'
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
    return null unless @props.onContinue
    <Button bsStyle="primary" onClick={@props.onContinue}>
      Continue
    </Button>

  shouldOpenNewTab: -> true

  getContentChapterSection: ->
    {chapter_section, related_content} = TaskStepStore.get(@props.id)
    (
      related_content &&
      related_content[0] &&
      related_content[0].chapter_section
    ) || chapter_section || []

  getContentChapter: ->
    @getContentChapterSection()?[0]

  getContentSection: ->
    @getContentChapterSection()?[1]

  getContentTitle: ->
    {related_content} = TaskStepStore.get(@props.id)
    related_content && related_content[0] && related_content[0].title # || look up by @getContentChapterSection()

  render: ->
    {id, stepType} = @props

    {content_html} = TaskStepStore.get(id)
    {courseId} = Router.currentParams()

    <div className="#{stepType}-step">
      <div className="#{stepType}-content" {...CourseData.getCourseDataProps(courseId)}>

        <RelatedContent contentId={id}
          chapter_section={@getContentChapterSection()}
          title={@getContentTitle()}
        />
        <ArbitraryHtmlAndMath
          className='book-content'
          shouldExcludeFrame={@shouldExcludeFrame}
          html={content_html}
        />
        {@renderNextStepLink()}
      </div>
      <AnnotationWidget
        courseId={courseId}
        chapter={@getContentChapter()}
        section={@getContentSection()}
        title={@getContentTitle()}
        documentId={@getCnxId()}
        pageType={stepType}
      />

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
