React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
BS = require 'react-bootstrap'

ArbitraryHtmlAndMath = require '../html'
ExerciseIdentifierLink = require './identifier-link'
Question = require '../question'
VideoPlaceholder = require './video-placeholder'
InteractivePlaceholder = require './interactive-placeholder'
Badges = require './preview/badges'
ControlsOverlay = require './preview/controls-overlay'
Exercise = require 'model/exercise'

ExercisePreview = React.createClass

  propTypes:
    extractTag:      React.PropTypes.func
    displayFeedback: React.PropTypes.bool
    displayAllTags:  React.PropTypes.bool
    displayFormats:  React.PropTypes.bool
    panelStyle:      React.PropTypes.string
    className:       React.PropTypes.string
    header:          React.PropTypes.element
    hideAnswers:     React.PropTypes.bool
    onOverlayClick:  React.PropTypes.func
    isSelected:      React.PropTypes.bool
    isInteractive:   React.PropTypes.bool
    overlayActions:  React.PropTypes.shape(
      message: React.PropTypes.string.isRequired
      handler: React.PropTypes.func.isRequired
    )
    exercise:        React.PropTypes.shape(
      content: React.PropTypes.object
      tags:    React.PropTypes.array
    ).isRequired
    isVerticallyTruncated: React.PropTypes.bool

  getDefaultProps: ->
    panelStyle: 'default'
    isInteractive:   true
    overlayActions:  {}
    extractTag: (tag) ->
      content = _.compact([tag.name, tag.description]).join(' ') or tag.id
      isLO = _.include(['lo', 'aplo'], tag.type)
      {content, isLO}

  renderTag: (tag) ->
    {content, isLO} = @props.extractTag(tag)
    classes = if isLO
      content = "LO: #{content}" if isLO
      'lo-tag'
    else
      'exercise-tag'
    <span key={tag.id or tag.name} className={classes}>{content}</span>


  renderFooter: ->
    <div className="controls">
      {@props.children}
    </div>

  renderPlaceholders: ->
    return null if @props.isInteractive isnt false
    placeholders = []
    placeholders.push(<VideoPlaceholder key='video'/>) if Exercise.hasVideo(@props.exercise)
    placeholders.push(<InteractivePlaceholder key='interactive'/>) if Exercise.hasInteractive(@props.exercise)
    if placeholders.length
      <div className="placeholders">{placeholders}</div>
    else
      null

  render: ->
    content = @props.exercise.content

    tags = _.clone @props.exercise.tags
    unless @props.displayAllTags
      tags = _.where tags, is_visible: true
    renderedTags = _.map(_.sortBy(tags, 'name'), @renderTag)
    classes = classnames( 'openstax-exercise-preview', @props.className, {
      'answers-hidden':   @props.hideAnswers
      'has-actions':      not _.isEmpty(@props.overlayActions)
      'is-selected':      @props.isSelected
      'actions-on-side':  @props.actionsOnSide
      'non-interactive':  @props.isInteractive is false
      'is-vertically-truncated': @props.isVerticallyTruncated
      'is-displaying-formats':   @props.displayFormats
      'is-displaying-feedback':  @props.displayFeedback
    })

    questions = _.map(content.questions, (question, questionIter) =>
      question = _.omit(question, 'answers') if @props.hideAnswers

      <Question
        key={questionIter}
        className='openstax-question-preview'
        model={question}
        choicesEnabled={false}
        displayFormats={@props.displayFormats}
        show_all_feedback={@props.displayFeedback}
        type='teacher-preview'
      >
        {@props.questionFooters?[questionIter]}
      </Question>
    )

    <BS.Panel
      className={classes}
      bsStyle={@props.panelStyle}
      header={@props.header}
      footer={@renderFooter() if @props.children}
    >
      {<div className='selected-mask' /> if @props.isSelected}

      <ControlsOverlay exercise={@props.exercise}
        actions={@props.overlayActions} onClick={@props.onOverlayClick} />

      <Badges isInteractive={@props.isInteractive} exercise={@props.exercise} />

      <ArbitraryHtmlAndMath className='stimulus' block={true} html={content.stimulus_html} />
      {@renderPlaceholders()}
      {questions}
      <div className='exercise-uid'>Exercise ID: {@props.exercise.content.uid}</div>
      <div className='exercise-tags'>{renderedTags}</div>
    </BS.Panel>

module.exports = ExercisePreview
