React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
{PeriodActions, PeriodStore} = require '../../flux/period'
{TutorInput}  = require '../tutor-input'
{AsyncButton} = require 'shared'
{CourseStore} = require '../../flux/course'
Icon = require '../icon'
{default: PH}   = require '../../helpers/period'
Time = require '../time'
BindStoreMixin      = require '../bind-store-mixin'
CourseGroupingLabel = require '../course-grouping-label'

{SpyMode, AsyncButton} = require 'shared'


ViewArchivedPeriods = React.createClass

  propTypes:
    courseId:     React.PropTypes.string.isRequired
    afterRestore: React.PropTypes.func.isRequired

  mixins: [BindStoreMixin]

  bindStore: PeriodStore

  bindUpdate: ->
    archived = PH.archivedPeriods(CourseStore.get(@props.courseId))
    if _.isEmpty(archived)
      @close()
    else
      @forceUpdate()

  getInitialState: ->
    showModal: false

  close: ->
    @setState({showModal: false})

  open: ->
    @setState({showModal: true})

  restore: (period) ->
    PeriodActions.restore(period.id, @props.courseId)
    PeriodStore.once 'restore', @props.afterRestore

  render: ->
    archived = PH.archivedPeriods(CourseStore.get(@props.courseId))
    return null if _.isEmpty(archived)
    <SpyMode.Content unstyled className="view-archived-periods">

      <BS.Button
        onClick={@open}
        bsStyle='link'
        className="control view-archived-periods"
      >
        View Archived <CourseGroupingLabel courseId={@props.courseId} />

        <BS.Modal
          show={@state.showModal}
          onHide={@close}
          className='settings-view-archived-periods-modal'>

          <BS.Modal.Header closeButton>
            <BS.Modal.Title>
              Archived <CourseGroupingLabel courseId={@props.courseId} />
            </BS.Modal.Title>
          </BS.Modal.Header>

          <BS.Modal.Body>
            <p>
              The table below shows previously
              archived <CourseGroupingLabel lowercase courseId={@props.courseId} /> of
              this course.
            </p>
            <p>
              You can "unarchive"
              a <CourseGroupingLabel lowercase courseId={@props.courseId} /> to
              make it visible again.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Name</th><th colSpan=2>Archive date</th>
                </tr>
              </thead>
              <tbody>
                {for period in archived
                  <tr key={period.id}>
                    <td>{period.name}</td>
                    <td><Time date={period.archived_at} /></td>
                    <td>
                      <span className='control restore-period'>
                        <AsyncButton className='unarchive-section' bsStyle='link'
                          onClick={_.partial(@restore, period)}
                          isWaiting={PeriodStore.isRestoring(period.id)}
                          isFailed={PeriodStore.isFailed(period.id)}
                        >
                          <Icon type="recycle" /> Unarchive
                        </AsyncButton>
                      </span>
                    </td>
                  </tr>}
              </tbody>
            </table>
          </BS.Modal.Body>

        </BS.Modal>
      </BS.Button>
    </SpyMode.Content>

module.exports = ViewArchivedPeriods
