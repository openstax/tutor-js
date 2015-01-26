React = require 'react'
CardMixin = require './card-mixin'
KatexMixin = require './katex-mixin'
HeaderMixin = require './header-mixin'
DialogButton = require './dialog-button'
HtmlEditor = require './html-editor'
{MultiMode} = require './multi-mode'
FORMATTING_BUTTONS = require './formatting-buttons'

{ExerciseActions, ExerciseStore, EXERCISE_MODES} = require '../stores/exercise'

View = React.createClass
  mixins: [CardMixin, KatexMixin]

  hasDefaultAction: ->
    # If the user does not have permissions then do not provide actions
    ExerciseStore.getExerciseMode() is EXERCISE_MODES.EDIT

  defaultAction: -> @props.onEditMode()
  renderActions: ->
    # If the user does not have permissions then do not provide actions
    return null unless ExerciseStore.getExerciseMode() is EXERCISE_MODES.EDIT

    html = @props.model.stimulus_html
    if html # either it doesn't exist or it's empty. if empty, treat it as though it does not exist
      [
        <DialogButton onClick={@props.onEditMode}>Edit Background</DialogButton>
        <DialogButton onClick={@onRemove} isDanger=true isRight=true>
          <i className="fa fa-trash-o"></i>
        </DialogButton>
      ]
    else
      <DialogButton onClick={@props.onEditMode}>Add Background</DialogButton>

  renderContent: ->
    html = @props.model.stimulus_html
    if html # either it doesn't exist or it's empty. if empty, treat it as though it does not exist
      <div className="exercise-background has-html" dangerouslySetInnerHTML={__html: html} />
    else
      null # Just show the "Add Background" actions

  onRemove: ->
    if confirm('Are you sure you want to remove the background?')
      ExerciseActions.removeExerciseStimulus(@props.model)


Toolbar = React.createClass
  mixins: [HeaderMixin]

  renderFirstRow: ->
    [
      <span className="brand-logo question-toolbar-title">Editing Background</span>
      <button className="btn-toolbar btn-close" onClick={@props.onClose}><i className="mdi-navigation-close"></i></button>
    ]

  renderSecondRow: ->
    # The formatting buttons
    @props.children


Edit = React.createClass
  mixins: [CardMixin]

  getInitialState: ->
    objects:
      htmlGetter: null

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

  renderContent: ->
    html = @props.model.stimulus_html
    <HtmlEditor toolbarId="#hack-quill-toolbar-id" html={html} onChange={@onChange} />

  onChange: (htmlGetter) -> @state.objects.htmlGetter = htmlGetter

  onCancel: -> @props.onViewMode()
  onDone: ->
    html = @state.objects.htmlGetter()
    ExerciseActions.changeExerciseStimulus(@props.model, html)
    @props.onViewMode()



module.exports = React.createClass
  displayName: 'Background'

  render: ->
    <MultiMode
      className="background"
      viewClass={View}
      editClass={Edit}
      model={@props.model}
    />
