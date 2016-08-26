React = require 'react'
Icon = require '../icon'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

{RosterActions, RosterStore} = require '../../flux/roster'

DUPLICATE_CODE = 'student_identifier_has_already_been_taken'

StudentIdField = React.createClass

  propTypes:
    studentId: React.PropTypes.string.isRequired
    courseId:  React.PropTypes.string.isRequired

  getInitialState: ->
    isEditing: false

  componentDidUpdate: (prevProps, prevState) ->
    if @state.isEditing and not prevState.isEditing
      el = @refs.input.getDOMNode()
      el.select()
      el.focus()

  onUpdateId: (ev) ->
    RosterActions.setStudentIdentifier(@props.courseId, @props.studentId, ev.target.value)

  onEditId: (ev) ->
    ev.preventDefault()
    @setState(isEditing: not @state.isEditing)

  onEditBlur: (ev) ->
    if RosterStore.hasChangedStudentIdentifier(@props.studentId)
      RosterActions.saveStudentIdentifier(@props)

    # If blur was triggered by clicking on the editTrigger,
    # let the onClick of the editTrigger toggle the isEditing state.
    @setState(isEditing: false) unless ev.relatedTarget is @refs.editTrigger.getDOMNode()

  renderInput: (identifier) ->
    <input type="text" ref="input"
      value={identifier}
      onChange={@onUpdateId}
      onBlur={@onEditBlur}
    />

  renderId: (identifier) ->
    <div className="identifier" onClick={@onEditId}>
      {identifier}
    </div>

  renderIcon: (hasError) ->
    if hasError
      <Icon type="exclamation-triangle" tooltip="Student ID is already in use" tooltipProps={
        placement: 'top'
        trigger: ['hover', 'focus']
      } />
    else
      <Icon
          type={if RosterStore.isSaving(@props.studentId) then "spinner" else "edit"}
          spin={@state.isSaving}
        />

  render: ->
    id = RosterStore.getStudentIdentifier(@props.courseId, @props.studentId)
    hasError = RosterStore.getError(@props.studentId)?.code is DUPLICATE_CODE
    classes = classnames('student-id', {'with-error': hasError})

    <div className={classes}>
      {if @state.isEditing then @renderInput(id) else @renderId(id)}

      <a href="#"
        tabIndex={ if @state.isEditing then -1 else 0 }
        onClick={@onEditId}
        ref='editTrigger'
      >
        {@renderIcon(hasError)}
      </a>


    </div>


module.exports = StudentIdField
