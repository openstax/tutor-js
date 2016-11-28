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

DeletePeriodLink = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object.isRequired
    afterDelete: React.PropTypes.func.isRequired

  getInitialState: ->
    warning: ''
    isArchiving: false

  close: ->
    @props.afterDelete()
    @refs.overlay?.hide()
    @setState(isArchiving: false)

  performDelete: ->
    PeriodActions.delete(@props.period.id, @props.courseId)
    PeriodStore.once 'deleted', @close
    @setState(isArchiving: true)

  renderPopover: ->
    <BS.Popover id='delete-period' className="delete-period">
      <p className="message">
        Archiving means
        this <CourseGroupingLabel lowercase courseId={@props.courseId} /> will
        not be visible on your dashboard, student scores, or export.
      </p>
      <div className="footer">
        <AsyncButton className='delete-section' onClick={@performDelete}
          isWaiting={PeriodStore.isDeleting(@props.period.id)}
          isFailed={PeriodStore.isFailed(@props.period.id)}
        >
          <Icon type='delete' /> Delete
        </AsyncButton>
        <BS.Button bsStyle="link" className="cancel" onClick={@close}>
          Cancel
        </BS.Button>

      </div>

    </BS.Popover>

  render: ->
    return null if _.isEmpty @props.periods
    <BS.OverlayTrigger rootClose={true} ref='overlay'
      trigger='click' placement='bottom' overlay={@renderPopover()}>
        <a className="control delete-period">
          <Icon type='delete' /> Delete <CourseGroupingLabel
            courseId={@props.courseId} />
        </a>
    </BS.OverlayTrigger>

module.exports = DeletePeriodLink
