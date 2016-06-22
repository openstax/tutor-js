React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{PeriodActions, PeriodStore} = require '../../flux/period'
{TutorInput} = require '../tutor-input'
{AsyncButton} = require 'openstax-react-components'

CourseGroupingLabel = require '../course-grouping-label'


AddPeriodField = React.createClass

  displayName: 'AddPeriodField'
  propTypes:
    label: React.PropTypes.object.isRequired
    name:  React.PropTypes.string.isRequired
    default: React.PropTypes.string
    onChange:  React.PropTypes.func.isRequired
    autofocus: React.PropTypes.bool

  componentDidMount: ->
    @refs.input.focus() if @props.autofocus

  onChange: (value) ->
    @props.onChange(value)

  render: ->
    <TutorInput
      ref="input"
      label={@props.label}
      default={@props.default}
      required={true}
      onChange={@onChange}
      validate={@props.validate} />



module.exports = React.createClass
  displayName: 'AddPeriodLink'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    periods:  React.PropTypes.array.isRequired


  getInitialState: ->
    period_name: ''
    showModal: false
    isCreating: false
    submitted: false

  close: ->
    @setState({showModal: false, isCreating: false, period_name: '', submitted: false})

  open: ->
    @setState({showModal: true})

  validate: (name) ->
    error = PeriodStore.validatePeriodName(name, @props.periods)
    @setState({invalid: error?})
    error

  performUpdate: ->
    @setState({submitted: true})
    if not @state.invalid
      @setState(isCreating: true)
      PeriodActions.create(@props.courseId, name: @state.period_name)
      PeriodStore.once 'created', => @close()

  renderForm: ->
    formClasses = ['modal-body', 'teacher-edit-period-form']
    if @state?.invalid and @state.submitted
      formClasses.push('is-invalid-form')
      disabled = true
    title = <h4>Add <CourseGroupingLabel courseId={@props.courseId} /></h4>
    label = <span><CourseGroupingLabel courseId={@props.courseId} /> Name</span>

    <BS.Modal
      {...@props}
      show={@state.showModal}
      onHide={@close}
      className='teacher-edit-period-modal'>

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>{title}</BS.Modal.Title>
      </BS.Modal.Header>

      <div className={formClasses.join(' ')}>
        <AddPeriodField
        label={label}
        name='period-name'
        default={@state.period_name}
        onChange={(val) => @setState(period_name: val)}
        validate={@validate}
        autofocus />
      </div>

      <div className='modal-footer'>
        <AsyncButton
          className='-edit-period-confirm'
          onClick={@performUpdate}
          isWaiting={@state.isCreating}
          waitingText="Adding..."
          disabled={disabled}>
          Add
        </AsyncButton>
      </div>

    </BS.Modal>

  render: ->
    <li className='control add-period'>
      <BS.Button onClick={@open} bsStyle='link'>
        <i className='fa fa-plus' />
        Add <CourseGroupingLabel courseId={@props.courseId} />
      </BS.Button>
      {@renderForm()}
    </li>
