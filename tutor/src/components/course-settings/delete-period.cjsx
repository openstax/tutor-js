React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{PeriodActions, PeriodStore} = require '../../flux/period'
{RosterActions, RosterStore} = require '../../flux/roster'
{TutorInput} = require '../tutor-input'
{SpyMode, AsyncButton} = require 'shared'

Icon = require '../icon'
CourseGroupingLabel = require '../course-grouping-label'
EMPTY_WARNING = 'EMPTY'
{AsyncButton} = require 'shared'


DeleteCourseModal = (props) ->

  <BS.Modal
    show={props.show}
    onHide={props.onClose}
    className='delete-period'>

    <BS.Modal.Header closeButton>
      <BS.Modal.Title>Delete {props.period.name}</BS.Modal.Title>
    </BS.Modal.Header>
    <BS.Modal.Body>
      <p>
        If you delete this section you will no longer have access to work
        done in that section and those students will be removed from the course.
      </p>
      <p>
        Are you sure you want to delete this section?
      </p>
    </BS.Modal.Body>
    <BS.Modal.Footer>
      <AsyncButton
        bsStyle="danger"
        onClick={props.onDelete}
        waitingText='Deleting…'
        isWaiting={props.isBusy}
      >Delete</AsyncButton>
      <BS.Button
        disabled={props.isBusy}
        onClick={props.onClose}>Cancel</BS.Button>

    </BS.Modal.Footer>

  </BS.Modal>

DeletePeriodLink = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object.isRequired
    afterDelete: React.PropTypes.func.isRequired

  getInitialState: ->
    isShown: false

  onClose: ->
    @setState(isShown: false)

  displayModal: ->
    @setState(isShown: true)

  performDelete: ->
    PeriodActions.delete(@props.period.id, @props.courseId)
    PeriodStore.once 'deleted', @onClose
    @setState(isShown: false)


  render: ->
    return null if _.isEmpty @props.periods
    <BS.Button onClick={@displayModal} bsStyle='link' className="control delete-period" >
      <DeleteCourseModal
        show={@state.isShown}
        period={@props.period}
        onClose={@onClose}
        isBusy={PeriodStore.isDeleting(@props.period.id)}
        onDelete={@performDelete}
      />
      <Icon type='archive' />
      Delete <CourseGroupingLabel courseId={@props.courseId} />
    </BS.Button>


module.exports = DeletePeriodLink
