React = require 'react'
Icon = require '../icon'
_ = require 'underscore'
{RosterActions, RosterStore} = require '../../flux/roster'

StudentIdField = React.createClass

  propTypes:
    student: React.PropTypes.shape(
      id: React.PropTypes.string
      student_identifier: React.PropTypes.string
    )

  getInitialState: ->
    isEditing: false
    student_identifier: @props.student.student_identifier

  componentDidUpdate: (prevProps, prevState) ->
    if @state.isEditing and not prevState.isEditing
      el = @refs.input.getDOMNode()
      el.select()
      el.focus()

  onUpdateId: (ev) ->
    @setState(student_identifier: ev.target.value)

  onEditId: (ev) ->
    ev.preventDefault()
    @setState(isEditing: not @state.isEditing)

  onEditBlur: (ev) ->
    if @state.student_identifier isnt @props.student.student_identifier
      @setState(isSaving: true)
      RosterActions.save(@props.student.id, student_identifier: @state.student_identifier)
      RosterStore.once "saved:#{@props.student.id}", =>
        @setState(isSaving: false) if @isMounted()

    # If blur was triggered by clicking on the editTrigger,
    # let the onClick of the editTrigger toggle the isEditing state.
    @setState(isEditing: false) unless ev.relatedTarget is @refs.editTrigger.getDOMNode()

  renderInput: ->
    <input type="text" ref="input"
      value={@state.student_identifier}
      onChange={@onUpdateId}
      onBlur={@onEditBlur}
    />

  renderId: ->
    <div className="identifier" onClick={@onEditId}>
      {@state.student_identifier}
    </div>

  render: ->
    <div className="student-id">
      {if @state.isEditing then @renderInput() else @renderId()}
      <a href="#"
        tabIndex={ if @state.isEditing then -1 else 0 }
        onClick={@onEditId}
        ref='editTrigger'
      >
        <Icon
          type={if @state.isSaving then "spinner" else "edit"}
          spin={@state.isSaving}
        />
      </a>
    </div>


module.exports = StudentIdField
