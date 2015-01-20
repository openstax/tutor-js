React = require 'react'
CardMixin = require './card-mixin'
KatexMixin = require './katex-mixin'
HeaderMixin = require './header-mixin'
DialogButton = require './dialog-button'
HtmlEditor = require './html-editor'
MultiMode = require './multi-mode'
FORMATTING_BUTTONS = require './formatting-buttons'

{ExerciseActions, ExerciseStore, EXERCISE_MODES} = require './flux/exercise'

View = React.createClass
  mixins: [CardMixin, KatexMixin]

  hasDefaultAction: -> true
  defaultAction: -> @props.onEditMode()
  renderActions: ->
    html = @props.model.stem_html
    [
      <DialogButton onClick={@props.onEditMode}>Edit</DialogButton>
      <DialogButton onClick={@props.onPreviewMode}>Preview</DialogButton>
      <DialogButton onClick={@onRemove} isDanger=true isRight=true>
        <i className="fa fa-trash-o"></i>
      </DialogButton>
    ]

  renderContent: ->
    html = @props.model.stem_html

    answers = for answer in @props.model.answers
      <div className="answers-answer">
        <div className="answer-letter"></div>
        <div className="answer-content has-html" dangerouslySetInnerHTML={__html: answer.content_html} />
      </div>

    [
      <div className="question-stem has-html" dangerouslySetInnerHTML={__html: html} />
      <div className="answers-table">
        {answers}
      </div>
    ]

  onRemove: ->
    if confirm('Are you sure you want to remove the entire question?')
      ExerciseActions.removeQuestion(@props.parent, @props.model)


Preview = React.createClass
  mixins: [CardMixin, KatexMixin]

  hasDefaultAction: -> false

  renderActions: ->
    # If the user does not have permissions then do not provide actions
    return null unless ExerciseStore.getExerciseMode() is EXERCISE_MODES.EDIT

    html = @props.model.stem_html
    [
      <DialogButton onClick={@props.onEditMode}>Edit</DialogButton>
      <DialogButton onClick={@props.onViewMode}>Done</DialogButton>
    ]

  renderContent: ->
    html = @props.model.stem_html
    qid = @props.model.id

    answers = for answer, i in @props.model.answers
      <div className="-answer-preview-wrapper">
        <input id="#{qid}-option-#{i}" name="#{qid}-options" type="radio" className="answer-input-box" />
        <label htmlFor="#{qid}-option-#{i}" className="answers-answer">
          <div className="answer-letter" />
          <div className="answer-content has-html" dangerouslySetInnerHTML={__html: answer.content_html} />
        </label>
      </div>

    [
      <div className="question-stem has-html" dangerouslySetInnerHTML={__html: html} />
      <div className="answers-table">
        {answers}
      </div>
    ]


Toolbar = React.createClass
  mixins: [HeaderMixin]

  renderFirstRow: ->
    [
      <span className="brand-logo question-toolbar-title">Editing Question</span>
      <button className="btn-toolbar btn-close" onClick={@props.onClose}><i className="mdi-navigation-close"></i></button>
    ]

  renderSecondRow: ->
    # The formatting buttons
    @props.children


EditAnswer = React.createClass
  render: ->
    html = @props.model.content_html

    <div className="answers-answer">
      <div className="answer-letter"></div>
      <div className="answer-content">
        <HtmlEditor toolbarId="#hack-quill-toolbar-id" html={html} onChange={@props.onChange} noInitialFocus={@props.noInitialFocus} />
      </div>
      <div className="answer-actions">
        <DialogButton isDanger={true} onClick={@props.onRemove}>
          <i className="fa fa-trash-o"></i>
        </DialogButton>
      </div>
    </div>


aryRemove = (ary, item) ->
  index = ary.indexOf(item)
  if index >= 0
    ary.splice(index, 1)
  else
    throw new Error('BUG: Item not found in array')
  true


Edit = React.createClass
  mixins: [CardMixin]

  getInitialState: ->
    objects:
      htmlGetter: null
    # HACK: Deep-clone the answers so we can identify them when editing/removing
    # plus the backend discards existing ones anyway
    answers: JSON.parse(JSON.stringify(@props.model.answers))
    # When a new answer is added, editor refreshes and the focus should move to the bottom answer
    justAddedAnswer: false

  renderActions: ->
    [
      <DialogButton onClick={@onCancel}>Cancel</DialogButton>
      <DialogButton onClick={@onDone}>Done</DialogButton>
    ]

  renderHeader: ->
    <Toolbar ref="toolbar" onClose={@onCancel}>
      <span id="hack-quill-toolbar-id">
        {FORMATTING_BUTTONS}
      </span>
    </Toolbar>

  renderAnswers: ->
    noInitialFocus = !@state.justAddedAnswer
    @state.justAddedAnswer = false

    answers = for answer in @state.answers
      do (answer) =>
        changeAnswer = (htmlGetter) ->
          answer.content_html = htmlGetter()
        removeAnswer = =>
          if confirm('Are you sure?')
            aryRemove(@state.answers, answer) or throw new Error('BUG: removing unknown answer')
            @setState({})

        <EditAnswer
          model={answer}
          onChange={changeAnswer}
          onRemove={removeAnswer}
          noInitialFocus={noInitialFocus} />
    answers

  renderContent: ->
    html = @props.model.stem_html
    answers = @renderAnswers()
    [
      <label>Stem</label>
      <HtmlEditor toolbarId="#hack-quill-toolbar-id" html={html} onChange={@onChange} />
      <div className="answers-table">
        {answers}
        <div className="answers-answer answer-new" onClick={@onNewAnswer}>
          <div className="answer-letter"></div>
          <div className="answer-content">Add a new Answer</div>
          <div className="answer-actions">
          </div>
        </div>
      </div>
    ]

  onChange: (htmlGetter) -> @state.objects.htmlGetter = htmlGetter
  onNewAnswer: ->
    answers = @state.answers
    answers.push({content_html: ''})
    @setState {answers, justAddedAnswer:true}

  onCancel: -> @props.onViewMode()
  onDone: ->
    # Update the question stem..
    # If it changed then htmlGetter will be defined
    if @state.objects.htmlGetter
      html = @state.objects.htmlGetter()
      ExerciseActions.changeQuestion(@props.model, html)
    # Update the list of answers
    ExerciseActions.changeAnswers(@props.model, @state.answers)
    @props.onViewMode()


module.exports = React.createClass
  displayName: 'Question'

  render: ->
    initialMode = switch ExerciseStore.getExerciseMode()
      when EXERCISE_MODES.VIEW then 'mode-preview'
      when EXERCISE_MODES.EDIT then 'mode-view'
      when EXERCISE_MODES.REVIEW then 'mode-preview'
      else throw new Error('BUG!')

    <MultiMode
      className="question"
      viewClass={View}
      editClass={Edit}
      previewClass={Preview}
      model={@props.model}
      parent={@props.parent}
      initialMode={initialMode}
    />
