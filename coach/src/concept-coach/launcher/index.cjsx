React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

BackgroundAndDesk = require './background-and-desk'
QuestionSVG = require '../question-svg'

{channel} = require '../model'


Launcher = React.createClass
  displayName: 'Launcher'
  propTypes:
    isLaunching: React.PropTypes.bool
    defaultHeight: React.PropTypes.number
  getDefaultProps: ->
    isLaunching: false
    defaultHeight: 388
  getInitialState: ->
    height: @getHeight()
  componentWillReceiveProps: (nextProps) ->
    @setState(height: @getHeight(nextProps)) if @props.isLaunching isnt nextProps.isLaunching

  getHeight: (props) ->
    props ?= @props
    {isLaunching, defaultHeight} = props
    if isLaunching then window.innerHeight else defaultHeight


  render: ->
    {isLaunching, defaultHeight} = @props
    {height} = @state

    classes =

    <div className='concept-coach-launcher-wrapper'>
      <div className="border-well">
        <div className={classnames('concept-coach-launcher', launching: isLaunching)}>
          <div className="header">
            <span>Already enrolled in this course?</span>
            <button onClick={@onLogin}>Login</button>
          </div>
          <div className="body">
            <div className="study">
              <div className="cta">
                <h1>Study smarter with OpenStax Concept Coach</h1>
                <button onClick={@onEnroll}>Enroll in This Class</button>
              </div>
              <div className="fine-print">
                <p>Course-specific enrollment code required.</p>
                <p>Each semester has a new code.</p>
              </div>
            </div>
            <QuestionSVG />
          </div>
        </div>
      </div>
    </div>


module.exports = {Launcher}
