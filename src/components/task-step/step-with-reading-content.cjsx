React = require 'react'

{TaskStepStore} = require '../../flux/task-step'
{ArbitraryHtmlAndMath, ChapterSectionMixin} = require 'openstax-react-components'
{BookContentMixin, LinkContentMixin} = require '../book-content-mixin'

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
  shouldOpenNewTab: -> true
  render: ->
    {id, courseDataProps, stepType} = @props
    {content_html} = TaskStepStore.get(id)

    <ArbitraryHtmlAndMath
      {...courseDataProps}
      className={"#{stepType}-step"}
      html={content_html} />


StepContent = React.createClass
  displayName: 'StepContent'

  propTypes:
    id: React.PropTypes.string.isRequired
    stepType: React.PropTypes.string.isRequired

  mixins: [LinkContentMixin]
  # used by LinkContentMixin
  getCnxId: ->
    TaskStepStore.getCnxId(@props.id)

  shouldExcludeFrame: ->
    @props.stepType is 'interactive'

  render: ->
    {id, stepType} = @props
    {content_html} = TaskStepStore.get(id)
    <div className={"#{stepType}-step"}>
      <ArbitraryHtmlAndMath className={"#{stepType}-content"} html={content_html} shouldExcludeFrame={@shouldExcludeFrame} />
    </div>


module.exports = {StepContent, ReadingStepContent}
