React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

CCLogo = require 'shared/src/components/logos/concept-coach-horizontal'
User = require '../../user/model'

BackgroundAndDesk = require './background-and-desk'
QuestionSVG = require '../question-svg'

{channel} = require '../model'

LoginAction = (props) ->
  return null unless props.isVisible
  <div className="actions">
    <span>Already enrolled in this course?</span>
    <button onClick={props.onLogin}>Login</button>
  </div>
LoginAction.displayName = 'LoginAction'

EnrollmentCode = (props) ->
  <div className="fine-print enrollment">
    <p>Course-specific enrollment code required.</p>
    <p>Ask your instructor for a code</p>
  </div>

SwitchSections = (props) ->
  <div className="fine-print switch">
    <p>
      Want to switch sections or enroll in another course
      using this book? <a role="button" onClick={props.onEnroll}>Change enrollment</a>
    </p>
  </div>

Launcher = React.createClass
  displayName: 'Launcher'
  propTypes:
    isLaunching: React.PropTypes.bool
    defaultHeight: React.PropTypes.number
    onLogin: React.PropTypes.func.isRequired
    onEnroll: React.PropTypes.func.isRequired
    collectionUUID: React.PropTypes.string.isRequired

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

  componentWillMount: ->
    User.channel.on 'change', @update
  componentWillUnmount: ->
    User.channel.off 'change', @update
  update: -> @forceUpdate()

  primaryActionText: ->
    if User.isEnrolled(@props.collectionUUID) then 'Launch Concept Coach' else 'Enroll in This Course'

  render: ->
    {isLaunching, defaultHeight} = @props
    {height} = @state
    isLoggedIn = User.isLoggedIn()
    FinePrint = if User.isEnrolled(@props.collectionUUID) then SwitchSections else EnrollmentCode

    <div className={
      classnames('concept-coach-launcher-wrapper',
        'is-logged-in': isLoggedIn
        'is-loading': User.isLoading
        'is-enrolled': User.isEnrolled(@props.collectionUUID)
      )}
    >
      <div className="border-well">
        <div className={classnames('concept-coach-launcher', launching: isLaunching)}>
          <div className="header">
            <CCLogo />
            <LoginAction onLogin={@props.onLogin} isVisible={not isLoggedIn} />
          </div>
          <div className="body">
            <div className="words">
              <div className="cta">
                <h1>Study Smarter with OpenStax</h1>
                <h1>Concept Coach</h1>
                <button onClick={@props.onEnroll}>
                  {@primaryActionText()}
                </button>
              </div>
              <FinePrint {...@props} />
            </div>
            <QuestionSVG {...@props} />
          </div>
        </div>
      </div>
    </div>


module.exports = Launcher
