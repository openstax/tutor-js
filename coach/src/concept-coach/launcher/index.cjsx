React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

CCLogo = require 'shared/src/components/logos/concept-coach-horizontal'
User = require '../../user/model'

CoachGraphic = require '../../graphics/coach'

{channel} = require '../model'

LoginAction = (props) ->
  return null unless props.isVisible
  <div className="actions">
    <span>Already enrolled in this course?</span>
    <BS.Button onClick={props.onLogin}>Login</BS.Button>
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
    {isLaunching, defaultHeight, enrollmentCode} = @props
    {height} = @state
    isLoggedIn = User.isLoggedIn()
    finePrint = if User.isEnrolled(@props.collectionUUID)
      <SwitchSections {...@props}/>
    else unless enrollmentCode?
      <EnrollmentCode {...@props}/>
    else
      null

    <div className={
      classnames('concept-coach-launcher-wrapper',
        'is-logged-in': isLoggedIn
        'is-loading': User.isLoading
        'is-enrolled': User.isEnrolled(@props.collectionUUID)
      )}
    >
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
              <BS.Button className='btn-openstax-primary' onClick={@props.onEnroll}>
                {@primaryActionText()}
              </BS.Button>
            </div>
            {finePrint}
          </div>
          <CoachGraphic {...@props} />
        </div>
      </div>
    </div>


module.exports = Launcher
