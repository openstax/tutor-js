React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{PeriodActions, PeriodStore} = require '../../flux/period'
{RosterActions, RosterStore} = require '../../flux/roster'
{TutorInput} = require '../tutor-input'
{AsyncButton} = require 'openstax-react-components'

Icon = require '../icon'
CourseGroupingLabel = require '../course-grouping-label'
EMPTY_WARNING = 'EMPTY'

ArchivePeriodLink = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object.isRequired
    selectPreviousTab: React.PropTypes.func.isRequired

  getInitialState: ->
    warning: ''
    showModal: false
    isDeleting: false

  close: ->
    @setState({showModal: false, isDeleting: false})

  open: ->
    @setState({showModal: true})

  performUpdate: ->
    if @isPeriodEmpty()
      # tab to be deleted cannot be activeTab unless first, so select previous or first
      @props.selectPreviousTab()
      id = @props.period.id

      @setState isDeleting: true
      PeriodActions.delete(id, @props.courseId)
      PeriodStore.once 'deleted', => @close()
    else
      @setState(warning: EMPTY_WARNING)

  isPeriodEmpty: ->
    id = @props.period.id
    students = RosterStore.getActiveStudentsForPeriod(@props.courseId, id)
    students.length is 0

  renderForm: ->
    if not @isPeriodEmpty()
      @state.warning = EMPTY_WARNING
    else
      @state.warning = ''
    deleteQuestion = "Delete '#{@props.period.name}'?"
    deleteButton =
      <AsyncButton
        className='-edit-period-confirm'
        onClick={@performUpdate}
        isWaiting={@state.isDeleting}
        waitingText="Deleting...">
        Delete
      </AsyncButton>
    warning = if @state.warning is EMPTY_WARNING
      <span>
        Only <CourseGroupingLabel courseId={@props.courseId} lowercase/>s without
         students enrolled can be deleted.
      </span>
    title =
      <h4>Delete <CourseGroupingLabel courseId={@props.courseId}/></h4>

    <BS.Modal
      {...@props}
      show={@state.showModal}
      onHide={@close}
      className="teacher-edit-period-modal">

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>{title}</BS.Modal.Title>
      </BS.Modal.Header>

      <div className='modal-body teacher-edit-period-form'>

        <div className='-delete-question'>
          {deleteQuestion if @isPeriodEmpty()}
        </div>
        <div className='warning'>
          {warning}
        </div>

      </div>

      <div className='modal-footer'>
        {deleteButton if @isPeriodEmpty()}
      </div>

    </BS.Modal>

  render: ->
    return null if _.isEmpty @props.periods

    <span className='control delete-period'>
      <BS.Button onClick={@open} bsStyle='link'>
        <Icon type='archive' />
        Archive <CourseGroupingLabel courseId={@props.courseId}/>
      </BS.Button>
      {@renderForm()}
    </span>


module.exports = ArchivePeriodLink
