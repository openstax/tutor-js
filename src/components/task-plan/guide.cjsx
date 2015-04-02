React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'
d3 = require 'd3'

{CourseStore, CourseActions} = require '../../flux/course'
LoadableMixin = require '../loadable-mixin'


d3guide = {}

d3guide.create = (el, props, state) ->
  svg = d3.select(el).append('svg')
    .attr('class', 'd3')
    .attr('width', props.width)
    .attr('height', props.height)
    #.attr("viewBox", "0 0 900 500")
    #.attr("preserveAspectRatio", "xMinYMin meet")

  svg = d3.select(".d3")

  svg.append('g')
    .attr('class', 'd3-guide')

  svg.append('g')
    .attr('class', 'd3-guide-x-axis')

  svg.append('g')
    .attr('class', 'd3-guide-y-axis')

  @update(el, state)
  return

d3guide.update = (el, state) ->
  scales = @_scales(el, state.domain)
  @_drawGuide(el, scales, state.data)

d3guide.destroy = (el) ->

d3guide._scales = (el, domain) ->
  if !domain
    return null
  width = el.offsetWidth
  height = el.offsetHeight
  x = d3.scale.linear().domain(domain.x).range([0, width])
  y = d3.scale.linear().domain(domain.y).range([height, 0])
  z = d3.scale.linear().domain([1,10]).range([5, 20])
  {
    x: x
    y: y
    z: z
  }

d3guide._drawGuide = (el, scales, data) ->

  g = d3.select(el).selectAll('.d3-guide')

  g.append("svg:text")
    .attr("x", 20)
    .attr("y", 20)
    .attr("style", "font-size: 20px; font-family: RobotoDraft")
    .text("Physics - All topics")

  xAxis = d3.svg.axis()
    .orient("bottom")
    .scale(scales.x)
    .ticks(10)

  yAxis = d3.svg.axis()
    .orient("left")
    .scale(scales.y)
    .ticks(10)

  g
    .attr("class", "grid")

    

  xAxisGroup = d3.select(el).selectAll('.d3-guide-x-axis')

  xAxisGroup
    .call(xAxis)
    .attr("transform", "translate(0," + (el.offsetHeight) + ")")
    #.attr("transform", "translate(0," + (el.offsetHeight-xAxisGroup.node().getBBox().height) + ")")

  yAxisGroup = d3.select(el).selectAll('.d3-guide-y-axis')

  yAxisGroup

    .call(yAxis)
    #.attr("transform", "rotate(-90)")


  #console.log(xAxisGroup.node().getBBox())
  console.log('offsetwidth: '+el.offsetWidth+' offsetheight: '+el.offsetHeight)

  point = g.selectAll('.d3-point')
    .data(data, (d) -> d.id)

  point.enter().append('circle')
    .attr('class', 'd3-point')

  point
    .attr('cx', (d) -> scales.x(d.x))
    .attr('cy', (d) -> scales.y(d.y))
    .attr('r', (d) -> scales.z(d.z))

  point.exit().remove()  


##############################################################################################


Chart = React.createClass
  
  propTypes:
    data: React.PropTypes.array,
    domain: React.PropTypes.object

  componentDidMount: ->
    el = @getDOMNode()
    d3guide.create el, {
      width: '900'
      height: '500'
    }, @getChartState()

  componentDidUpdate: ->
    el = @getDOMNode()
    console.log(React.findDOMNode(@))
    console.log(@getDOMNode())
    d3guide.update(el, @getChartState())

  getChartState: ->
    return {
      data: @props.data,
      domain: @props.domain
    }

  componentWillUnmount: ->
    el = @getDOMNode()
    d3guide.destroy(el)

  render: ->
    <div className="Chart"></div>
  
  
sampleData = [
  {id: '5fbmzmtc', x: 7, y: 41, z: 6},
  {id: 's4f8phwm', x: 11, y: 45, z: 9},
]

guideData = [
    {"id": 123,"title": "Introduction to Physics","unit": 1,"questions_answered_count": 48,"current_level": 0.8,"page_ids": [234,345],"practice_count": 12},
    {"id": 124,"title": "Motion &amp; Kinematics","unit": 2,"questions_answered_count": 55,"current_level": 0.6,"page_ids": [234,345],"practice_count": 22},
    {"id": 125,"title": "Unit 3","unit": 3,"questions_answered_count": 68,"current_level": 0.45,"page_ids": [234,345],"practice_count": 3},
    {"id": 126,"title": "Unit 4","unit": 4,"questions_answered_count": 67,"current_level": 0.3,"page_ids": [234,345],"practice_count": 28},
    {"id": 127,"title": "Unit 5","unit": 5,"questions_answered_count": 9,"current_level": 0.5,"page_ids": [234,345],"practice_count": 7}
]
    


GuideShell = React.createClass
  mixins: [LoadableMixin]

  contextTypes:
    router: React.PropTypes.func

  getFlux: ->
    store: CourseStore
    actions: CourseActions

  getId: ->
    {courseId} = @context.router.getCurrentParams()
    courseId

  getInitialState: ->
    {
      data: sampleData,
      domain: {x: [0, 30], y: [0, 100]}
    }
  

  renderCrudeTable: (data,i) ->

    <tr>
      <td>{data.id}</td>
      <td>{data.title}</td>
      <td>{data.unit}</td>
      <td>{data.questions_answered_count}</td>
      <td>{data.current_level}</td>
      <td className="course-guide-table-pageids">{data.page_ids}</td>
      <td>{data.practice_count}</td>
    </tr>
  

  renderLoaded: ->
    id = @getId()

    if CourseStore.isGuideLoaded(id)
      guide = CourseStore.getGuide(id)
      table = _.map(guide.fields, @renderCrudeTable)
      

      <BS.Panel className="-course-guide-container">
        <div className="-course-guide-table">
          <div className="-course-guide-heading">
            <h2>guide data crude table</h2>
          </div>
            <BS.Table className="-reading-progress-group">
              <thead>
                <tr>
                  <th>id</th>
                  <th>title</th>
                  <th>unit</th>
                  <th>questions_answered_count</th>
                  <th>current_level</th>
                  <th>page_ids</th>
                  <th>practice_count</th>
                </tr>
              </thead>
              <tbody>
                {table}
              </tbody>
            </BS.Table>
            <div className="course-guide-line-graph">
              <Chart data={@state.data} domain={@state.domain} />
            </div>
          </div>
      </BS.Panel>

    else
      CourseActions.loadGuide(id)
      <div className="-loading -guide">Loading Guide</div>

module.exports = {GuideShell}
