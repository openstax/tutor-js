React = require 'react'
CardMixin = require './card-mixin'
DialogButton = require './dialog-button'

{ExerciseActions} = require './flux/exercise'

module.exports = React.createClass
  mixins: [CardMixin]

  getInitialState: ->
    isAddingQuestion: false

  defaultAction: -> @onAddQuestion()
  renderActions: ->
    if @props.model.questions.length is 0
      <DialogButton onClick={@onAddQuestion}>Add a Question</DialogButton>
    else
      <DialogButton onClick={@onAddQuestion}>Add Another Question</DialogButton>

  onAddQuestion: ->
    @setState {isAddingQuestion: true}


Toolbar = React.createClass
  mixins: [HeaderMixin]

  renderFirstRow: ->
    [
      <span className="brand-logo question-toolbar-title">Editing Background</span>
      
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
