React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
BS = require 'react-bootstrap'

ArbitraryHtmlAndMath = require '../html'
ExerciseIdentifierLink = require './identifier-link'
Question = require '../question'

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
    onSelection:     React.PropTypes.func
    onDetailsClick:  React.PropTypes.func
    isSelected:      React.PropTypes.bool
    isHeightLimited: React.PropTypes.bool
    exercise:        React.PropTypes.shape(
      content: React.PropTypes.object
      tags:    React.PropTypes.array
    ).isRequired

  getDefaultProps: ->
    panelStyle: 'default'
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

  onOverlayClick: (ev) ->
    @props.onSelection(ev, not @props.isSelected, @props.exercise)

  onDetailsClick: (ev) ->
    ev.stopPropagation() # needed to prevent click from triggering onOverlay handler
    @props.onDetailsClick(ev, @props.exercise)

  renderFooter: ->
    <div className="controls">
      {@props.children}
      <ExerciseIdentifierLink exerciseId={@props.exercise.content.uid} />
    </div>


  renderToggleOverlay: ->

    <div onClick={@onOverlayClick} className={classnames('toggle-mask', {active: @props.isSelected})}>
      <div className='message'>
        <div className='block select'>
          <span>{if @props.isSelected then 'ReInclude question' else 'Exclude question'}</span>
        </div>
        {<div onClick={@onDetailsClick} className='block details'>
          <span>Question details</span>
        </div> if @props.onDetailsClick}
      </div>

    </div>

  render: ->
    content = @props.exercise.content
    question = content.questions[0]

    tags = _.clone @props.exercise.tags
    unless @props.displayAllTags
      tags = _.where tags, is_visible: true
    renderedTags = _.map(_.sortBy(tags, 'name'), @renderTag)
    classes = classnames( 'openstax-exercise-preview', @props.className, {
      'answers-hidden': @props.hideAnswers
      'is-selectable':  @props.onSelection
      'is-selected':    @props.isSelected
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
      footer={@renderFooter()}
    >
      {@renderToggleOverlay() if @props.onSelection?}
      <ArbitraryHtmlAndMath className='-stimulus' block={true} html={content.stimulus_html} />
      {questions}
      <div className='exercise-tags' key='tags'>{renderedTags}</div>
    </BS.Panel>

module.exports = ExercisePreview
