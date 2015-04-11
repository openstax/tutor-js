React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
d3 = require 'd3'

{LearningGuideStore, LearningGuideActions} = require '../../flux/learning-guide'
LoadableItem = require '../loadable-item'

Chart = React.createClass

  getDefaultProps: ->
    {
      # SVG is vector so width/height don't really matter.  100 is just a convenient # to multiple by
      width: 100
      height: 60 # approx 2/3 width, adjust to suite
      
      cloudsPath: '/style/resources/clouds.svg'
      hippoPath: 'http://nathan.stitt.org/images/hippo.png'
    }

  addImage: (url,options)->
    node = @refs.svg.getDOMNode()
    d3.select(node).append("svg:image")
      .attr('x',options.x)
      .attr('y',options.y)
      .attr('width', options.width   || 10)
      .attr('height', options.height || 10)
      .attr("xlink:href", url)

  drawChart: (guide)->
    node = @refs.svg.getDOMNode()

    # static images.  First two are local svg, hippo is hot linked image

    container = d3.select(this.refs.svg.getDOMNode())
     .attr("preserveAspectRatio", "xMidYMid meet")
     .attr("viewBox", "0 0 #{this.props.width} #{this.props.height}")

    fields = guide.fields
    window.df = guide.fields

    units = []
    i = 0

    while i < fields.length
      units.push fields[i].unit
      i++


    domain = {
      x: [
          d3.min(units), 
          d3.max(units)
         ],
      y: [0, 1]
    }

# scales

    xScale = d3.scale
      .linear()
      .domain(domain.x)
      .range([0, @props.width])

    yScale = d3.scale
      .linear()
      .domain(domain.y)
      .range([@props.height, 0])

    # axes

    xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .ticks(5)

    yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .ticks(10)

    xAxisGroup = container.append('g')
      .attr('class','tutor-chart-x-axis')
      .call(xAxis)
      .attr("transform", "translate(0," + (@props.height) + ")")

    yAxisGroup = container.append('g')
      .attr('class','tutor-chart-y-axis')
      .call(yAxis)
      # axis container positioning needs to be more dynamic; right now im just making them visible.
      .attr("transform", "translate(8,0)")



    space_between = 100/fields.length+1
    points = _.map(fields, (f,i)=>
        {
          x: Math.max(space_between * i + (space_between/2), 5)
          y: @props.height - f.current_level * @props.height
        }
    )
    # order matters. Items placed later will appear in front of earlier items
    # If needed, explicit stacking could be specified
    this.drawVerticalLines(container, points);
    this.drawStaticImages(container, points);
    this.drawPlotLines(container, points);
    this.drawCircles(container, fields, points);

  # Future improvement: Place clouds so they aren't
  # hidden behind the points
  drawStaticImages: (container, points)->
    this.addImage(this.props.cloudsPath, width:10, x: 35, y: 10)
    this.addImage(this.props.cloudsPath, width:16, x: 77, y: 20)
    this.addImage(this.props.hippoPath,  width: 8, x: 92, y: 50)

  drawCircles: (container, fields, points)->
    wrap = container.append('g')
      .attr('class', 'circles')
       .selectAll("g")
       .data(fields)

    circles = wrap.enter()
      .append("g")
      .attr("transform", (f,i)->
        "translate(#{points[i].x},#{points[i].y})"
      )
      .on("click", (field)=>
        @navigateToPractice(field)
      )
    circles.append("circle")
      .attr('r', (f)->
        # awaiting a better alogorithm for the circle radius
        Math.max(f.questions_answered_count / 20, 2)
      )
    circles.append("text")
      .text( (f)->
        f.questions_answered_count
      )
      .attr("text-anchor", "middle")
      .attr("dy", "0.5")

  drawPlotLines: (container, points)->
    wrap = container.append('g')
      .attr('class', 'plot-lines')
       .selectAll("line")
       .data( points[0...points.length-1] )
       # ^^ We don't want to create a line for the last point

    wrap.enter()
      .append("line")
      .attr("x1", (p)->p.x )
      .attr("y1", (p)->p.y)
      .attr("x2", (p,i)->points[i+1].x )
      .attr("y2", (p,i)->points[i+1].y )

  drawVerticalLines: (container, points)->
    wrap = container.append('g')
      .attr('class', 'grid-lines')
       .selectAll("line")
       .data(points)

    wrap.enter()
      .append("line")
      .attr("x1", (p)->p.x )
      .attr("y1", 0)
      .attr("x2", (p)->p.x )
      .attr("y2", @props.height)

  navigateToPractice: (activity)->
    console.log "Navigate to activity ID #{activity.id} (#{activity.title})"

  componentDidMount: ->
    @drawChart LearningGuideStore.get(@props.courseId)

  componentDidUpdate: ->
    ## D3 commands to update SVG

  render: ->
    <div className="Chart">
      <svg ref="svg">
      </svg>
      <div ref="footer" className="footer"></div>
    </div>


LearningGuideShell = React.createClass

  contextTypes:
    router: React.PropTypes.func

  getFlux: ->
    store: LearningGuideStore
    actions: LearningGuideActions

  render: ->
    courseId=@context.router.getCurrentParams().courseId
    <BS.Panel className="course-guide-container">
      <div className="course-guide-line-chart">
        <LoadableItem
          id={courseId}
          store={LearningGuideStore}
          actions={LearningGuideActions}
          renderItem={=> <Chart courseId={courseId} />}
        />
      </div>
    </BS.Panel>

module.exports = {LearningGuideShell}
