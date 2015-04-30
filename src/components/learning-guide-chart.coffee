_ = require 'underscore'
d3 = require 'd3'
{AppConfigStore} = require '../flux/app-config'

CITYSCAPE_PATH = 'learning-guide/houston-skyline.svg'
CLOUD_PATH     = 'learning-guide/cloud.svg'
PLANE_PATH     = 'learning-guide/openstax-plane.svg'
FLAG_BLUE      = 'learning-guide/flag-blue.svg'
FLAG_GREEN     = 'learning-guide/flag-green.svg'
FLAG_YELLOW    = 'learning-guide/flag-yellow.svg'
FLAG_GREY      = 'learning-guide/flag-grey.svg'

# SVG is vector so width/height don't really matter.  100 is just a convenient # to multiple by
WIDTH = 160
HEIGHT = 49 # approx 2/3 width, adjust to suit

# used for green x-axis bar and clipping path
XRECTHEIGHT = 4.49


module.exports = class LearningGuideChart

  constructor: (@svgNode, @navigateToPractice, @displayUnit, @displayTopic) ->
    @constructor = constructor

  addImage: (url, options, className) ->
    node = @svgNode
    d3.select(node).append('svg:image')
      .attr('x', options.x)
      .attr('y', options.y)
      .attr('width', options.width   or 10)
      .attr('height', options.height or 10)
      .attr('xlink:href', AppConfigStore.urlForResource(url))
      .attr('class', className)

  drawChart: (guide, showAll) ->
    node = @svgNode

    container = d3.select(@svgNode)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', "0 0 #{WIDTH} #{HEIGHT}")

    if showAll
      fields = guide.children
    else
      fields = guide.children[0].children


    leftMargin = 25
    topMargin = 5


    space_between = (WIDTH - leftMargin) / fields.length

    points = _.map(fields, (f, i) ->
      {
        x: Math.max(leftMargin + space_between * i)
        y: (HEIGHT - topMargin) - (f.current_level / 1.18) * (HEIGHT - topMargin)
      }
    )


    # order matters. Items placed later will appear in front of earlier items
    # If needed, explicit stacking could be specified

    @drawBackgroundGradient(container)
    @drawVerticalLines(container, points)
    @drawStaticImages(container, points)
    #@drawHills(container)
    @drawPlotLines(container, points)
    @drawCircles(container, fields, points)
    @drawPlane(container, points)


    @drawXRect(container)
    @drawXAxis(container, fields, points)

    @drawYLabel(container, 8, 'Ace')
    @drawYLabel(container, 19, 'Cruising')
    @drawYLabel(container, 30, 'Too Low')
    @drawYLabel(container, 41, 'Grounded')

    @drawYDesc(container, 8, 'Current Estimate of Understanding')

    @drawTitle(container, guide)




  drawTitle: (container, guide) ->
    wrap = container.append('g')
      .append('svg:text')
      .attr('text-anchor', 'middle')
      .attr('x', WIDTH / 2)
      .attr('y', 3)
      .attr('class', 'main-title')
      .text("Your Flight Path | #{guide.title} | All Topics | ")
      .append('svg:a')
      .attr('class', 'show-course noselect')
      .text("Show All #{guide.title}")
      .on('click', =>
        @displayTopic()
        detailPane = document.querySelector('.learning-guide-chart .footer')
        detailPane.classList.remove('active')
      )

  drawXRect: (container) ->
    wrap = container.append('svg:rect')
      .attr('width', WIDTH)
      .attr('height', XRECTHEIGHT)
      .attr('y', HEIGHT - XRECTHEIGHT)
      .attr('class', 'x-rect')

  drawXAxis: (container, fields, points) ->
    clip = container.append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('id', 'clip-rect')
      .attr('width', WIDTH)
      .attr('height', XRECTHEIGHT)
      .attr('y', HEIGHT - XRECTHEIGHT)
    wrap = container.append('g')
      .attr('clip-path', 'url(#clip)')
      .attr('class', 'x-axis')
      .selectAll('line')
      .data(fields)
    me = @ # Since displayUnit needs this and the 'this' scope still needs @parentElement
    label = wrap.enter()
      .append('g')
      .attr('class', 'point')
      .attr('transform', (f, i) ->
        "translate(#{points[i].x}, #{HEIGHT - 4})"
      )
      .on('click', (field) ->
        # remove 'active' class from all groups
        d3.selectAll(@parentElement.children).classed('active', false)
        # and add it to ourselves
        d3.select(this).classed('active', true)

        caretOffset = this.attributes.transform.value.match(/\((.*),/).pop()
        detailPane = document.querySelector('.learning-guide-chart .footer')
        detailPane.classList.add('active')

        # this is a rough calc for now, can center it better by subtracting container offset
        detailPane.style.marginLeft = (caretOffset * 5.5) + 'px'

        me.displayUnit(field)
      )
    label.append('circle')
      .attr('r', 3.7)
      .attr('cy', 1.8)
      .attr('class', 'x-axis-circle')
    label.append('polygon')
      .attr('class', 'arrow')
      .attr('points', '1,1.5 2,3 0,3')
      .attr('transform', 'translate(-1,1)')
    label.append('text')
      .attr('class', 'x-axis-label')
      .attr('text-anchor', 'middle')
      .attr('dy', '2.3')
      .attr('text-anchor', 'middle')
      .text( (f, i) -> f.chapter_section )




  drawYDesc: (container, ypos, text) ->
    wrap = container.append('g')
      .append('svg:text')
      .attr('text-anchor', 'end')
      .attr('x', 5)
      .attr('y', ypos)
      .attr('class', 'y-desc')
      .attr('transform', "rotate(-90, 8, #{ypos})")
      .text(text)

  drawYLabel: (container, ypos, text) ->
    wrap = container.append('g')
      .append('svg:text')
      .attr('text-anchor', 'end')
      .attr('x', 20)
      .attr('y', ypos)
      .attr('class', 'y-label')
      .text(text)


  getLineAngle: (x1, x2, y1, y2) ->
    deltaX = x2 - x1
    deltaY = y2 - y1
    rad = Math.atan2(deltaY, deltaX)
    deg = rad * (180 / Math.PI)
    deg


  drawPlane: (container, points) ->
    point = _.last(points)
    pointPrev = points[points.length - 2]
    lineAngle = @getLineAngle(pointPrev.x, point.x, pointPrev.y, point.y)
    node = @svgNode
    d3.select(node).append('svg:image')
      .attr('x', point.x + 2)
      .attr('y', point.y - 3)
      .attr('width', 8)
      .attr('height', 6)
      .attr('xlink:href', PLANE_PATH)
      .attr('transform', "rotate(#{lineAngle}, #{point.x}, #{point.y})")


  drawHills: (container) ->
    # might be nice to move this definition up into DefaultProps
    fgPath = [
      { x: -5, y: HEIGHT}
      { x: WIDTH * 0.20, y: HEIGHT * 0.80 }
      { x: WIDTH * 0.65, y: HEIGHT * 0.95 }
      { x: WIDTH + 10,   y: HEIGHT }
    ]
    bgPath = [
      { x: WIDTH * 0.30, y: HEIGHT}
      { x: WIDTH * 0.85, y: HEIGHT * 0.90 }
      { x: WIDTH * 0.95, y: HEIGHT * 0.95 }
      { x: WIDTH + 5, y: HEIGHT  }
    ]
    container.append('path')
      .attr('d', d3.svg.line()
        .x( (d) -> d.x )
        .y( (d) -> d.y )
        .interpolate('basis')(bgPath))
      .attr('class', 'background-hills')
    container.append('path')
      .attr('d', d3.svg.line()
        .x( (d) -> d.x )
        .y( (d) -> d.y )
        .interpolate('basis')(fgPath))
      .attr('class', 'foreground-hills')


  drawBackgroundGradient: (container) ->
    gradient = container.append('svg:defs')
      .append('svg:linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '50%')
      .attr('y1', '0%')
      .attr('x2', '50%')
      .attr('y2', '100%')
      .attr('class', 'background-gradient')
      .attr('spreadMethod', 'pad')

    gradient.append('svg:stop')
      .attr('offset', '0%')
      .attr('class', 'start')
      .attr('stop-opacity', 1)

    gradient.append('svg:stop')
      .attr('offset', '100%')
      .attr('class', 'end')
      .attr('stop-opacity', 1)

    container.append('svg:rect')
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .style('fill', 'url(#gradient)')


  drawStaticImages: (container, points) ->

    @addImage(CITYSCAPE_PATH, width:109.7, height:12, x:32, y:32.5)

    @addImage(FLAG_BLUE, width:10, height:2.5, x:13.2, y:6.3)
    @addImage(FLAG_GREEN, width:20, height:2.5, x:6.8, y:17.3)
    @addImage(FLAG_YELLOW, width:20, height:2.5, x:6.6, y:28.3)
    @addImage(FLAG_GREY, width:20, height:2.5, x:6.3, y:39.3)

    @addImage(CLOUD_PATH, width:40, height:15, x:110, y:2, 'cloud cloud-opacity-70')
    @addImage(CLOUD_PATH, width:18, height:7, x:105, y:4, 'cloud cloud-opacity-70')
    @addImage(CLOUD_PATH, width:15, height:15, x:30, y:2, 'cloud cloud-opacity-40')
    @addImage(CLOUD_PATH, width:20, height:10, x:38, y:7, 'cloud cloud-opacity-70')
    @addImage(CLOUD_PATH, width:20, height:15, x:135, y:2, 'cloud cloud-opacity-50')


  drawCircles: (container, fields, points) ->
    wrap = container.append('g')
      .attr('class', 'circles')
      .selectAll('g')
      .data(fields)

    circles = wrap.enter()
      .append('g')
      .attr('transform', (f, i) ->
        "translate(#{points[i].x}, #{points[i].y})"
      )
      .on('click', (field) =>
        @navigateToPractice(field)
      )
    circles.append('circle')
      .attr('r', 1.6)
      .attr('class', (f) ->
        lv = f.current_level
        if lv > .75
          'blue'
        else if lv <= .75 and lv >= .50
          'green'
        else if lv <= .49 and lv >= .35
          'yellow'
        else if lv < .35
          'grey'
      )
    # circles.append('text')
    #   .text( (f) ->
    #     f.questions_answered_count
    #   )
    #   .attr('text-anchor', 'middle')
    #   .attr('dy', '0.5')

  drawPlotLines: (container, points) ->
    wrap = container.append('g')
      .attr('class', 'plot-lines')
      .selectAll('line')
      .data( points[0...points.length - 1] )
       # ^^ We don't want to create a line for the last point

    wrap.enter()
      .append('line')
      .attr('x1', (p) -> p.x )
      .attr('y1', (p) -> p.y)
      .attr('x2', (p, i) -> points[i + 1].x )
      .attr('y2', (p, i) -> points[i + 1].y )

  drawVerticalLines: (container, points) ->
    wrap = container.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(points)

    wrap.enter()
      .append('line')
      .attr('x1', (p) -> p.x )
      .attr('y1', 7)
      .attr('x2', (p) -> p.x )
      .attr('y2', HEIGHT)
