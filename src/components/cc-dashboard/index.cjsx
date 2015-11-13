React = require 'react'
BS = require 'react-bootstrap'
{CoursePeriodsNav} = require '../course-periods-nav'
{CourseStore, CourseActions} = require '../../flux/course'
LoadableItem = require '../loadable-item'

CCDashboard = React.createClass
  getDefaultProps: ->
    initialActivePeriod: 0

  getInitialState: -> {}

  handlePeriodSelect: (period) ->
    @setState({period})

  render: ->
    courseId = @props.id
    periods = CourseStore.getCCPeriods(courseId)

    <BS.Panel className='reading-stats'>
      <CoursePeriodsNav
        handleSelect={@handlePeriodSelect}
        initialActive={@props.initialActivePeriod}
        periods={periods}
        courseId={courseId} />
        {@state.period?.id}
    </BS.Panel>

DashboardShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()

    <LoadableItem
      store={CourseStore}
      actions={CourseActions}
      load={CourseActions.loadCCDashboard}
      isLoaded={CourseStore.isCCDashboardLoaded}
      isLoading={CourseStore.isCCDashboardLoading}
      id={courseId}
      renderItem={-> <CCDashboard key={courseId} id={courseId} />}
    />

module.exports = DashboardShell

