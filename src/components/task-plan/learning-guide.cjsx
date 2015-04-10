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
    node = this.refs.svg.getDOMNode()
    d3.select(node).append("svg:image")
      .attr('x',options.x)
      .attr('y',options.y)
      .attr('width', options.width   || 10)
      .attr('height', options.height || 10)
      .attr("xlink:href", url)

  drawChart: (guide)->
    # static images.  First two are local svg, hippo is hot linked image
    this.addImage(this.props.cloudsPath, width:10, x: 20, y: 10)
    this.addImage(this.props.cloudsPath, width:16, x: 80, y: 20)
    this.addImage(this.props.hippoPath,  width: 8, x: 92, y: 50)

    WIDTH  = @props.width
    HEIGHT = @props.height

    fields = guide.fields
    space_between = 100/fields.length+1

    container = d3.select(this.refs.svg.getDOMNode())
     .attr("preserveAspectRatio", "xMidYMid meet")
     .attr("viewBox", "0 0 #{WIDTH} #{HEIGHT}")

    wrap = container.append('g')
      .attr('class', 'tutor-chart-lines')

    circles = wrap.selectAll("g")
      .data(fields)

    circleEnter = circles.enter()
      .append("g")
      .attr("transform", (f,i)->
        x=Math.max(space_between * i + (space_between/2), 5)
        y=HEIGHT - f.current_level * HEIGHT
        "translate(#{x},#{y})"
      )

    circleEnter.append("circle")
      .attr('r', (f)->
        # awaiting a better alogorithm for the circle radius
        Math.max(f.questions_answered_count / 20, 2)
      )
    circleEnter.append("text")
      .text( (f)->
        f.questions_answered_count
      )
      .attr("text-anchor", "middle")
      .attr("dy", "0.5")


  componentDidMount: ->
    this.drawChart LearningGuideStore.get(this.props.courseId)

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

  getId: ->
    @context.router.getCurrentParams().courseId

  getInitialState: ->
    {
      data: []
    }

  render: ->
    courseId=@getId()
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
