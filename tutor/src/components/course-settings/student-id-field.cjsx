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

  onUpdateId: (ev) ->
    @setState(student_identifier: ev.target.value)

  onEditId: (ev) ->
    ev.preventDefault()
    return if @state.isBlurring
    unless @state.isEditing
      _.defer =>
        el = @refs.input.getDOMNode()
        el.select()
        el.focus()
    @setState(isEditing: not @state.isEditing, isBlurring: false)

  onEditBlur: ->
    if @state.student_identifier isnt @props.student.student_identifier
      @setState(isSaving: true)
      RosterActions.save(@props.student.id, student_identifier: @state.student_identifier)
      RosterStore.once "saved:#{@props.student.id}", =>
        @setState(isSaving: false) if @isMounted()

    @setState(isEditing: false, isBlurring: true)
    # set "isBlurring" so we don't immediatly start editing again
    # when the blur is because the edit icon was clicked.  After a bit we reset it
    _.delay =>
      @setState(isBlurring: false)
    , 100

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
      >
        <Icon
          type={if @state.isSaving then "spinner" else "edit"}
          spin={@state.isSaving}
        />
      </a>
    </div>


module.exports = StudentIdField
