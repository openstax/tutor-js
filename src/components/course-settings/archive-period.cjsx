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

  renderActivity: ->
    <div className="message">
      <p>
        <Icon spin type='spinner' /> Archiving...
      </p>
    </div>

  renderMessage: ->
    <div className="message">
      <p>
        Archiving means this <CourseGroupingLabel courseId={@props.courseId} /> will
        not be visible on your dashboard, student scores or export.
      </p>
      <BS.Button className='archive-section' onClick={@performArchive}>
        <Icon type='archive' /> Archive
      </BS.Button>
      <a className="cancel" onClick={@close}>Cancel</a>
    </div>

  render: ->
    return null if _.isEmpty @props.periods

    <BS.OverlayTrigger rootClose={true} ref='overlay'
      trigger='click' placement='bottom' overlay={
        <BS.Popover id='delete-period' className="archive-period">
          {if @state.isArchiving then @renderActivity() else @renderMessage()}
        </BS.Popover>
      }>
        <a className="control">
          <Icon type='archive' /> Archive <CourseGroupingLabel
            courseId={@props.courseId} />
        </a>
    </BS.OverlayTrigger>


module.exports = ArchivePeriodLink
