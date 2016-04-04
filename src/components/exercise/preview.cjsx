React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
BS = require 'react-bootstrap'

ArbitraryHtmlAndMath = require '../html'
ExerciseIdentifierLink = require './identifier-link'

ExercisePreview = React.createClass

  propTypes:
    extractTag: React.PropTypes.func.isRequired
    displayFeedback: React.PropTypes.bool
    panelStyle: React.PropTypes.string
    className:  React.PropTypes.string
    header:     React.PropTypes.element
    displayAllTags: React.PropTypes.bool
    hideAnswers: React.PropTypes.bool
    toggleExercise: React.PropTypes.func
    isSelected: React.PropTypes.bool
    hoverMessage: React.PropTypes.string
    exercise:   React.PropTypes.shape(
      content: React.PropTypes.object
      tags:    React.PropTypes.array
    ).isRequired

  getDefaultProps: ->
    panelStyle: 'default'

  renderAnswer: (answer) ->
    classes = classnames 'answers-answer',
      correct: (answer.correctness is '1.0')

    <div key={answer.id} className={classes}>
      <div className="answer-letter" />
      <div className="answer">
        <ArbitraryHtmlAndMath className="choice" block={false} html={answer.content_html} />
        <ArbitraryHtmlAndMath className="feedback" block={false} html={answer.feedback_html} />
      </div>
    </div>

  renderTag: (tag) ->
    {content, isLO} = @props.extractTag(tag)
    classes = if isLO
      content = "LO: #{content}" if isLO
      'lo-tag'
    else
      'exercise-tag'
    <span key={tag.id or tag.name} className={classes}>{content}</span>

  onOverlayClick: (ev) ->
    @props.toggleExercise(ev, not @props.isSelected)

  renderFooter: ->
    <div className="controls">
      {@props.children}
      <ExerciseIdentifierLink exerciseId={@props.exercise.content.uid} />
    </div>

  renderToggleOverlay: ->
    <div onClick={@onOverlayClick} className={classnames('toggle-mask', {active: @props.isSelected})}>
      <div className='message'>
        {@props.hoverMessage}
      </div>
    </div>

  render: ->
    content = @props.exercise.content
    question = content.questions[0]

    unless @props.hideAnswers
      renderedAnswers = _.map(question.answers, @renderAnswer)

    tags = _.clone @props.exercise.tags
    unless @props.displayAllTags
      tags = _.where tags, is_visible: true
    renderedTags = _.map(_.sortBy(tags, 'name'), @renderTag)
    classes = classnames( 'exercise-preview', @props.className, {
      'answers-hidden': @props.hideAnswers,
      'is-selectable' : @props.toggleExercise?
      'is-selected': @props.isSelected
      'is-displaying-feedback': @props.displayFeedback
    })
    <BS.Panel
      className={classes}
      bsStyle={@props.panelStyle}
      header={@props.header}
      footer={@renderFooter()}
    >
      {@renderToggleOverlay() if @props.toggleExercise?}
      <ArbitraryHtmlAndMath className='-stimulus' block={true} html={content.stimulus_html} />
      <ArbitraryHtmlAndMath className='stem' block={true} html={question.stem_html} />
      <div className='answers-table'>{renderedAnswers}</div>
      <div className='detailed-solution'>
        <div className='header'>Detailed solution</div>
        <ArbitraryHtmlAndMath className="solution" block
          html={_.first(question.solutions)?.content_html} />
      </div>
      <div className='exercise-tags'>{renderedTags}</div>

    </BS.Panel>

module.exports = ExercisePreview
