React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{PeriodActions, PeriodStore} = require '../../flux/period'
{RosterActions, RosterStore} = require '../../flux/roster'
{TutorInput} = require '../tutor-input'

CourseGroupingLabel = require '../course-grouping-label'
EMPTY_WARNING = 'EMPTY'

module.exports = React.createClass
  displayName: 'DeletePeriodLink'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    periods: React.PropTypes.array.isRequired
    activeTab: React.PropTypes.object.isRequired
    selectPreviousTab: React.PropTypes.func.isRequired

  getInitialState: ->
    warning: ''

  performUpdate: ->
    if @isPeriodEmpty()
      @refs.overlay.hide()
      # tab to be deleted cannot be activeTab unless first, so select previous or first
      @props.selectPreviousTab()
      id = @props.activeTab.id
      PeriodActions.delete(id, @props.courseId)
    else
      @setState(warning: EMPTY_WARNING)

  isPeriodEmpty: ->
    id = @props.activeTab.id
    students = RosterStore.getActiveStudentsForPeriod(@props.courseId, id)
    students.length is 0

  renderForm: ->
    if not @isPeriodEmpty()
      @state.warning = EMPTY_WARNING
    else
      @state.warning = ''
    deleteQuestion = "Delete '#{@props.activeTab.name}'?"
    deleteButton =
      <BS.Button className='-edit-period-confirm' onClick={@performUpdate}>
        Delete
      </BS.Button>
    warning = if @state.warning is EMPTY_WARNING
      <span>
        Only <CourseGroupingLabel courseId={@props.courseId} lowercase/>
         without students enrolled can be deleted.
      </span>
    title =
      <span>Delete <CourseGroupingLabel courseId={@props.courseId}/></span>

    <BS.Modal
      {...@props}
      title={title}
      className="teacher-edit-period-modal">

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
    <BS.OverlayTrigger
      ref='overlay'
      rootClose={true}
      trigger='click'
      overlay={@renderForm()}>
        <BS.Button bsStyle='link' className='edit-period'>
          <i className='fa fa-trash-o' />
          Delete <CourseGroupingLabel courseId={@props.courseId}/>
        </BS.Button>
    </BS.OverlayTrigger>
