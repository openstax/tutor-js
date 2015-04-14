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
      planePath: '/style/resources/openstax-plane.svg'
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


    container = d3.select(this.refs.svg.getDOMNode())
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", "0 0 #{this.props.width} #{this.props.height}")

    fields = guide.fields

    space_between = @props.width/fields.length+1
    points = _.map(fields, (f,i)=>
        {
          x: Math.max(space_between * i + (space_between/4), 5)
          y: @props.height - f.current_level * @props.height
        }
    )
    # order matters. Items placed later will appear in front of earlier items
    # If needed, explicit stacking could be specified
    this.drawBackgroundGradient(container)
    this.drawVerticalLines(container, points)
    this.drawStaticImages(container, points)
    this.drawHills(container)
    this.drawPlotLines(container, points)
    this.drawCircles(container, fields, points)
    this.drawPlane(container, points)
    this.drawXAxis(container, fields, points)


  # Future improvement: Place clouds so they aren't
  # hidden behind the points

  drawStaticImages: (container, points)->
    this.addImage(this.props.cloudsPath, width:10, x: 35, y: 10)
    this.addImage(this.props.cloudsPath, width:16, x: 77, y: 20)


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


  drawXAxis: (container, fields, points)->
    wrap = container.append('g')
      .attr('class', 'x-axis')
      .selectAll("line")
      .data(fields)
    me=this
    label = wrap.enter()
      .append("g")
      .attr('class', "point")
      .attr("transform", (f,i)=>
        "translate(#{points[i].x},#{@props.height-4})"
      )
      .on("click", (field)->
        # remove "active" class from all groups
        d3.selectAll(this.parentElement.children).classed('active',false)
        # and add it to ourselves
        d3.select(this).classed("active",true)
        me.displayUnit(field)
      )
    label.append("polygon")
      .attr('class', "arrow").attr('points',  "1,1.5 2,3 0,3").attr("transform", "translate(-1,1)")
    label.append("text")
      .attr("text-anchor", "middle").attr("dy", "1.8").attr("text-anchor", "middle")
      .text( (f,i)-> i+1 )



  drawPlane: (container, points)->
    point=_.last(points)
    this.addImage(@props.planePath, x: point.x+2, y: point.y-3, height: 6, width: 8)

  drawHills: (container)->
    # might be nice to move this definition up into DefaultProps
    fgPath = [
      { x: -5, y: @props.height}
      { x: @props.width*0.20, y: @props.height * 0.80 }
      { x: @props.width*0.65, y: @props.height * 0.95 }
      { x: @props.width+10, y: @props.height }
    ]
    bgPath = [
      { x: @props.width*0.30, y: @props.height}
      { x: @props.width*0.85, y: @props.height * 0.90 }
      { x: @props.width*0.95, y: @props.height * 0.95 }
      { x: @props.width+5, y: @props.height  }
    ]
    container.append("path")
      .attr("d", d3.svg.line()
        .x( (d) -> d.x )
        .y( (d) -> d.y )
        .interpolate("basis")(bgPath))
      .attr("class", "background-hills")
    container.append("path")
      .attr("d", d3.svg.line()
        .x( (d) -> d.x )
        .y( (d) -> d.y )
        .interpolate("basis")(fgPath))
      .attr("class", "foreground-hills")


  drawBackgroundGradient: (container)->
    gradient = container.append("svg:defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "50%")
      .attr("y1", "0%")
      .attr("x2", "50%")
      .attr("y2", "100%")
      .attr("class", "background-gradient")
      .attr("spreadMethod", "pad")

    gradient.append("svg:stop")
      .attr("offset", "0%")
      .attr("class", "start")
      .attr("stop-opacity", 1)

    gradient.append("svg:stop")
      .attr("offset", "100%")
      .attr("class", "end")
      .attr("stop-opacity", 1)

    container.append("svg:rect")
      .attr("width", @props.width)
      .attr("height", @props.height)
      .style("fill", "url(#gradient)")

  # Future improvement: Place clouds so they aren't
  # hidden behind the points
  drawStaticImages: (container, points)->
    this.addImage(this.props.cloudsPath, width:10, x: 35, y: 10)
    this.addImage(this.props.cloudsPath, width:16, x: 77, y: 20)

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

  navigateToPractice: (unit)->
    console.log "Navigate to practice unit ID #{unit.id} (#{unit.title})"

  displayUnit: (unit)->
      console.log "Display unit: ID #{unit.id} (#{unit.title})"

  componentDidMount: ->
    @drawChart LearningGuideStore.get(@props.courseId)

  componentDidUpdate: ->
    ## D3 commands to update SVG

  render: ->
    <div className="learning-guide-chart">
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
    courseId = @props.courseId || @context.router.getCurrentParams().courseId
    <BS.Panel className="course-guide-container">
      <LoadableItem
        id={courseId}
        store={LearningGuideStore}
        actions={LearningGuideActions}
        renderItem={=> <Chart courseId={courseId} />}
      />
    </BS.Panel>

module.exports = {LearningGuideShell}
