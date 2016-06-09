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
    afterArchive: React.PropTypes.func.isRequired

  getInitialState: ->
    warning: ''
    isArchiving: false

  close: ->
    @props.afterArchive()
    @refs.overlay?.hide()
    @setState(isArchiving: false)

  performArchive: ->
    PeriodActions.delete(@props.period.id, @props.courseId)
    PeriodStore.once 'deleted', @close
    @setState(isArchiving: true)

  renderPopover: ->
    <BS.Popover id='archive-period' className="archive-period">
      <p className="message">
        Archiving means
        this <CourseGroupingLabel lowercase courseId={@props.courseId} /> will
        not be visible on your dashboard, student scores, or export.
      </p>
      <div className="footer">
        <AsyncButton className='archive-section' onClick={@performArchive}
          isWaiting={PeriodStore.isDeleting(@props.period.id)}
          isFailed={PeriodStore.isFailed(@props.period.id)}
        >
          <Icon type='archive' /> Archive
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
        <a className="control archive-period">
          <Icon type='archive' /> Archive <CourseGroupingLabel
            courseId={@props.courseId} />
        </a>
    </BS.OverlayTrigger>


module.exports = ArchivePeriodLink
