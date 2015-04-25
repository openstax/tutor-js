React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CourseActions, CourseStore} = require '../flux/course'
{LearningGuideStore, LearningGuideActions} = require '../flux/learning-guide'
LoadableItem = require './loadable-item'
LearningGuideChart = require './learning-guide-chart'
PracticeButton = require './practice-button'


LearningGuide = React.createClass
  displayName: 'LearningGuide'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.any.isRequired

  getInitialState: ->
    showAll: false

  navigateToPractice: (unit) ->
    {courseId} = @props
    @context.router.transitionTo('viewPractice', {courseId})

  displayUnit: (unit) ->
    @setState({unit})

  displayTopic: ->
    @setState({showAll:true})
    @loadChart()

  loadChart: ->
    chart = new LearningGuideChart(@refs.svg.getDOMNode(), @navigateToPractice, @displayUnit, @displayTopic)
    chart.drawChart(LearningGuideStore.get(@props.courseId), @state.showAll)

  componentDidMount: ->
    @loadChart()

  render: ->
    {unit} = @state

    if unit
      unitInfo = <div className="-title">{unit.title}</div>
      stars = <div className="-stars">star rating</div>
      practiceButton =
      <PracticeButton courseId={@props.courseId} pageIds={unit.page_ids}>Practice</PracticeButton>

    <div className="learning-guide-chart">
      <svg ref="svg" />
      <div ref="footer" className="footer">
        {unitInfo}
        {stars}
        {practiceButton}
      </div>
    </div>


LearningGuideShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    <BS.Panel className="course-guide-container">
      <LoadableItem
        id={courseId}
        store={LearningGuideStore}
        actions={LearningGuideActions}
        renderItem={-> <LearningGuide courseId={courseId} />}
      />
    </BS.Panel>

module.exports = {LearningGuideShell, LearningGuide}
