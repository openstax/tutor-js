React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
d3 = require 'd3'
# This doesn't actually "import" but does make
# sure the files is included in the build.
# need to figure out browserify wrapping non-amd packages later
nvd3 = require 'nvd3'

{LearningGuideStore, LearningGuideActions} = require '../../flux/learning-guide'
LoadableMixin = require '../loadable'

Chart = React.createClass

  chartData: ->
    guide=LearningGuideStore.get(this.props.courseId)
    values = []
    for field, index in guide.fields
      values.push( {x:index+1, y:field.current_level} )
    [
      {
        values: values
        key: "Levels"
      }
    ]

  componentDidMount: ->
    guide=LearningGuideStore.get(this.props.courseId)

    scale = d3.scale.linear()
      .domain([-1, 0, 1])
      .range(["red", "white", "green"]);

    chartDefinition = nv.models.lineChart()
      .margin({left: 100})  #Adjust chart margins to give the x-axis some breathing room.
      .useInteractiveGuideline(true)  #We want nice looking tooltips and a guideline!
      .showLegend(true)       #Show the legend, allowing users to turn on/off line series.
      .showYAxis(true)        #Show the y-axis
      .showXAxis(true)        #Show the x-axis
      .interpolate('cardinal')
      .padData(true)
      .yScale(scale)
      .forceY([0.0,1.0])

    # does not work, but is used on an example
    # docs mention that this is deprecated and
    # chart.tooltip.contentGenerator but there's no tooltip property
    chartDefinition.tooltipContent( ->
      return "hello";
    )

    @chart = d3.select(this.refs.svg.getDOMNode())
      .datum(@chartData())
      .call(chartDefinition)

    # This doesn't seem to work, but it did with dc.js
    footer = this.refs.footer.getDOMNode()
    xticks = @chart.selectAll(".nv-axis.nv-x text")
    xticks.on("click", (index)->
      console.log("Clicked Tick");
    )

  componentDidUpdate: ->
    # @chart.update({
    # })

  render: ->
    <div className="Chart">
      <svg ref="svg"></svg>
      <div ref="footer" className="footer"></div>
    </div>


LearningGuideShell = React.createClass
  mixins: [LoadableMixin]

  contextTypes:
    router: React.PropTypes.func

  getFlux: ->
    store: LearningGuideStore
    actions: LearningGuideActions

  getId: ->
    @context.router.getCurrentParams().courseId

  getInitialState: ->
    {
      data: []
    }

  renderLoaded: ->
    <BS.Panel className="course-guide-container">
      <div className="course-guide-line-chart">
        <Chart courseId={@getId()} />
      </div>
    </BS.Panel>

module.exports = {LearningGuideShell}
