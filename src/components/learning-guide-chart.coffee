_ = require 'underscore'
d3 = require 'd3'
{AppConfigStore} = require '../flux/app-config'


CITYSCAPE_PATH = 'houston-skyline.svg'
CLOUD_PATH     = 'cloud.svg'
PLANE_PATH     = 'openstax-plane.svg'
FLAG_BLUE      = 'flag-blue.svg'
FLAG_GREEN     = 'flag-green.svg'
FLAG_YELLOW    = 'flag-yellow.svg'
FLAG_GREY      = 'flag-grey.svg'
PENCIL_PATH    = 'guide-pencil.svg'


# SVG is vector so width/height don't really matter.  100 is just a convenient # to multiple by
WIDTH = 160
HEIGHT = 49 # approx 2/3 width, adjust to suit

# used for green x-axis bar and clipping path
XRECTHEIGHT = 5.1


module.exports = class LearningGuideChart

  constructor: (@svgNode, guide, showAll, chapter, @callbacks) ->
    window.addEventListener("resize", @onResize, false)

    node = @svgNode

    container = d3.select(@svgNode)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', "0 0 #{WIDTH} #{HEIGHT}")

    if showAll
      fields = guide.children
    else
      fields = guide.children[chapter - 1].children


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

    # must be called first to clear before re-render
    @destroyChart(container)


    @drawBackgroundGradient(container)
    @drawVerticalLines(container, points)
    @drawStaticImages(container, points)
    @drawPlotLines(container, points)
    @drawCircles(container, fields, points)
    @drawPlane(container, points)

    @drawXRect(container)
    @drawXAxis(container, fields, points)

    @drawYLabel(container, 7, 'Ace')
    @drawYLabel(container, 18, 'Cruising')
    @drawYLabel(container, 29, 'Too Low')
    @drawYLabel(container, 40.7, 'Grounded')

    @drawYDesc(container, 8, 'Current Estimate of Understanding')

    @drawTitle(container, guide, showAll, chapter)

    @showDefaultPanel(fields)


  addImage: (url, options, className) ->
    node = @svgNode
    d3.select(node).append('svg:image')
      .attr('x', options.x)
      .attr('y', options.y)
      .attr('width', options.width   or 10)
      .attr('height', options.height or 10)
      .attr('xlink:href', AppConfigStore.urlForResource(url))
      .attr('class', className)

  destroyChart: (container) ->
    container.selectAll("g").remove()
    container.selectAll("image").remove()
    container.selectAll("defs").remove()
    container.selectAll(".x-rect, #clip, .gradient-rect").remove()

  drawTitle: (container, guide, showAll, chapter) ->
    if showAll
      mainTitle = "Your Flight Path | #{guide.title} | All Topics | "
      backButtonText = "Back to Dashboard"
    else
      mainTitle = "Your Flight Path | #{guide.children[chapter - 1].title} | "
      backButtonText = "Show All #{guide.title}"
    wrap = container.append('g')
      .append('svg:text')
      .attr('text-anchor', 'middle')
      .attr('x', WIDTH / 2)
      .attr('y', 3)
      .attr('class', 'main-title')
      .text(mainTitle)
      .append('svg:a')
      .attr('class', 'show-course')
      .text(backButtonText)
      .on('click', =>
        @callbacks.displayTopic()
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
        me.showPanel(this, @parentElement.children)
        me.callbacks.displayUnit(field, parseInt(field.chapter_section[0]))
      )
    label.append('circle')
      .attr('r', 3.7)
      .attr('cy', 1.7)
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
      .text( (f, i) ->
        if f.chapter_section instanceof Array
          subsection = if f.chapter_section[1]? then '.' + f.chapter_section[1] else ''
          f.chapter_section[0] + subsection
        else
          f.chapter_section
        )

  destroy: ->
    window.removeEventListener("resize", @onResize, false)

  onResize: =>
    @showPanel(@svgNode.querySelector('.x-axis .point.active'), @svgNode.querySelector('.x-axis .point'))

  showDefaultPanel: (fields) ->
    field = fields[0]
    @showPanel(@svgNode.querySelector('.x-axis .point:first-child'), @svgNode.querySelector('.x-axis .point'))
    @callbacks.displayUnit(field, parseInt(field.chapter_section[0]))

  percent: (num, total) ->
    Math.round((num / total) * 100)

  showPanel: (target, children) ->
    # remove 'active' class from all groups
    d3.selectAll(children).classed('active', false)
    # and add it to ourselves
    d3.select(target).classed('active', true)

    caretOffset = target.attributes.transform.value.match(/\((.*),/).pop()

    viewboxWidth = this.svgNode.attributes.viewBox.value.split(' ')[2]
    svgClientWidth = this.svgNode.clientWidth

    detailPane = this.svgNode.parentElement.querySelector('.footer')
    detailPane.classList.add('active')

    panelOffset = (svgClientWidth - detailPane.clientWidth) / viewboxWidth



    detailPane.style.marginLeft = (caretOffset * panelOffset) + 'px'

    #detailPane.style.marginLeft = (caretOffset * panelOffset) / 10 + '%'




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
    if points.length > 1
      pointPrev = points[points.length - 2]
    else
      pointPrev = point
    lineAngle = @getLineAngle(pointPrev.x, point.x, pointPrev.y, point.y)
    node = @svgNode
    d3.select(node).append('svg:image')
      .attr('x', point.x + 2)
      .attr('y', point.y - 3)
      .attr('width', 8)
      .attr('height', 6)
      .attr('xlink:href', AppConfigStore.urlForResource(PLANE_PATH))
      .attr('transform', "rotate(#{lineAngle}, #{point.x}, #{point.y})")


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
      .attr('class', 'gradient-rect')
      .style('fill', 'url(#gradient)')


  drawStaticImages: (container, points) ->

    @addImage(CITYSCAPE_PATH, width:109.7, height:12, x:32, y:32.5)

    @addImage(FLAG_BLUE, width:10, height:2.5, x:13.2, y:5.3)
    @addImage(FLAG_GREEN, width:20, height:2.5, x:6.8, y:16.3)
    @addImage(FLAG_YELLOW, width:20, height:2.5, x:6.6, y:27.3)
    @addImage(FLAG_GREY, width:20, height:2.5, x:6.3, y:39)

    @addImage(CLOUD_PATH, width:40, height:15, x:110, y:2, 'cloud-opacity-70')
    @addImage(CLOUD_PATH, width:18, height:7, x:105, y:4, 'cloud-opacity-70')
    @addImage(CLOUD_PATH, width:15, height:15, x:30, y:2, 'cloud-opacity-40')
    @addImage(CLOUD_PATH, width:20, height:10, x:38, y:7, 'cloud-opacity-70')
    @addImage(CLOUD_PATH, width:20, height:15, x:135, y:2, 'cloud-opacity-50')


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
        @callbacks.navigateToPractice(field)
      )
    circles.append('circle')
      .attr('r', 1.6)
      .attr('class', (f) ->
        lv = f.current_level
        if lv > .75
          'ace'
        else if lv <= .75 and lv >= .50
          'cruising'
        else if lv <= .49 and lv >= .35
          'too-low'
        else if lv < .35
          'grounded'
      )
    circles.append('svg:image')
      .attr('xlink:href', AppConfigStore.urlForResource(PENCIL_PATH))
      .attr('class', 'icon-pencil')
      .attr('x', -1)
      .attr('y', -1.4)
      .attr('width', 2.4)
      .attr('height', 2.4)


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
