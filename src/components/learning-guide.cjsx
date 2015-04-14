React = require 'react'
BS = require 'react-bootstrap'

{LearningGuideStore, LearningGuideActions} = require '../flux/learning-guide'
LoadableItem = require './loadable-item'
LearningGuideChart = require './learning-guide-chart'


LearningGuide = React.createClass
  displayName: 'LearningGuide'

  navigateToPractice: (unit) ->
    console.log "Navigate to practice unit ID #{unit.id} (#{unit.title})"

  displayUnit: (unit) ->
      console.log "Display unit: ID #{unit.id} (#{unit.title})"

  componentDidMount: ->
    chart = new LearningGuideChart(@refs.svg.getDOMNode(), @navigateToPractice, @displayUnit)
    chart.drawChart(LearningGuideStore.get(@props.courseId))

  componentDidUpdate: ->
    ## D3 commands to update SVG

  render: ->
    <div className="learning-guide-chart">
      <svg ref="svg" />
      <div ref="footer" className="footer" />
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
