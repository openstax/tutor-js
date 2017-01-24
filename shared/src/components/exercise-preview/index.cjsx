React = require 'react'
_ = require 'underscore'
trimEnd = require 'lodash/trimEnd'
forEach = require 'lodash/forEach'
classnames = require 'classnames'
BS = require 'react-bootstrap'

ArbitraryHtmlAndMath = require '../html'
ExerciseIdentifierLink = require '../exercise-identifier-link'
Question = require '../question'
ExerciseBadges = require '../exercise-badges'
ControlsOverlay = require './controls-overlay'
Exercise = require '../../model/exercise'

ExercisePreview = React.createClass
  displayName: 'OXExercisePreview'
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
    overlayActions:  React.PropTypes.object
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
    sortTags: (tags, extractTag) ->
      tags = _.sortBy(tags, 'name')
      idTag = _.findWhere(tags, type: 'id')
      loTag = _.find(tags, (tag) ->
        {isLO} = extractTag(tag)
        isLO
      )
      if idTag then tags.splice(_.indexOf(tags, idTag), 1)
      if loTag then tags.splice(_.indexOf(tags, loTag), 0, idTag)
      else tags.push(idTag)
      tags

  renderTag: (tag) ->
    {content, isLO} = @props.extractTag(tag)
    key = tag.id or tag.name
    if isLO
      <div key={key} className='lo-tag'>LO: {content}</div>
    else
      <span key={key} className='exercise-tag'>{content}</span>

  renderFooter: ->
    <div className="controls">
      {@props.children}
    </div>

  getCleanPreview: ->
    {preview} = @props.exercise

    forEach(@props.exercise.content.questions, (question) =>
      preview = trimEnd(preview, question.stem_html)
    )

    preview

  renderStimulus: ->
    if @props.isInteractive or not @props.exercise.preview
      <ArbitraryHtmlAndMath className='stimulus' block={true}
        html={@props.exercise.content.stimulus_html} />
    else
      <ArbitraryHtmlAndMath className='stimulus' block={true}
        html={@getCleanPreview()} />



  render: ->
    content = @props.exercise.content

    tags = _.clone @props.exercise.tags
    unless @props.displayAllTags
      tags = _.where tags, is_visible: true
    tags.push(name: "ID: #{@props.exercise.content.uid}", type: 'id')
    renderedTags = _.map(@props.sortTags(tags, @props.extractTag), @renderTag)
    classes = classnames( 'openstax-exercise-preview', @props.className, {
      'answers-hidden':   @props.hideAnswers
      'has-actions':      not _.isEmpty(@props.overlayActions)
      'is-selected':      @props.isSelected
      'actions-on-side':  @props.actionsOnSide
      'non-interactive':  @props.isInteractive is false
      'is-vertically-truncated': @props.isVerticallyTruncated
      'is-displaying-formats':   @props.displayFormats
      'is-displaying-feedback':  @props.displayFeedback
      'has-interactive':  @props.exercise.has_interactive
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
      data-exercise-id={@props.exercise.id}
      tabIndex=-1
      footer={@renderFooter() if @props.children}
    >
      {<div className='selected-mask' /> if @props.isSelected}

      <ControlsOverlay exercise={@props.exercise}
        actions={@props.overlayActions} onClick={@props.onOverlayClick} />

      <div className="exercise-body" >

        <ExerciseBadges exercise={@props.exercise} />

        {<ArbitraryHtmlAndMath className='context' block={true}
          html={@props.exercise.context} /> unless _.isEmpty(@props.exercise.context) or not @props.isInteractive}

        {@renderStimulus()}

        {questions}
      </div>
      <div className='exercise-tags'>{renderedTags}</div>
    </BS.Panel>

module.exports = ExercisePreview
