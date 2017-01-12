React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
classnames = require 'classnames'

CCLogo = require 'shared/src/components/logos/concept-coach-horizontal'
UserStatusMixin = require '../../user/status-mixin'

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
    <p>Course-specific enrollment link required.</p>
    <p>Ask your instructor for a link</p>
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
    enrollmentCode: React.PropTypes.string
    setIsEnrollmentCodeValid: React.PropTypes.func

  getDefaultProps: ->
    isLaunching: false
    defaultHeight: 388
  getInitialState: ->
    height: @getHeight()
    isEnrollmentCodeValid: false

  componentWillReceiveProps: (nextProps) ->
    @setState(height: @getHeight(nextProps)) if @props.isLaunching isnt nextProps.isLaunching

  componentWillMount: ->
    if @props.enrollmentCode? and not @getUser().isEnrolled(@props.collectionUUID)
      @validateEnrollmentCode()

  validateEnrollmentCode: ->
    {enrollmentCode} = @props
    course = @getCourse()
    course.channel.once('validated', @setIsEnrollmentCodeValid)
    course.validate(enrollmentCode)

  setIsEnrollmentCodeValid: ->
    @props.setIsEnrollmentCodeValid?(true)
    @setState(isEnrollmentCodeValid: true)

  mixins: [UserStatusMixin]

  getHeight: (props) ->
    props ?= @props
    {isLaunching, defaultHeight} = props
    if isLaunching then window.innerHeight else defaultHeight

  primaryActionText: ->
    if @getUser().isEnrolled(@props.collectionUUID) then 'Launch Concept Coach' else 'Enroll in This Course'

  render: ->
    {isLaunching, defaultHeight} = @props
    {height, isEnrollmentCodeValid} = @state
    user = @getUser()
    isLoggedIn = user.isLoggedIn()
    finePrint = if user.isEnrolled(@props.collectionUUID)
      <SwitchSections {...@props}/>
    else if isEnrollmentCodeValid
      null
    else
      <EnrollmentCode {...@props}/>

    words = if isLaunching
      <h2>Launching Concept Coach...</h2>
    else [
      <h2 key='cta-headline'>Study Smarter with OpenStax</h2>
      <h2 key='cta-item'>Concept Coach</h2>
    ]


    <div className={
      classnames('concept-coach-launcher-wrapper',
        'is-logged-in': isLoggedIn
        'is-loading': user.isLoading
        'is-enrolled': user.isEnrolled(@props.collectionUUID)
      )}
    >
      <div className={classnames('concept-coach-launcher', launching: isLaunching)}>
        <div className="header">
          <CCLogo />
          <LoginAction onLogin={@props.onLogin} isVisible={not isLoggedIn} />
        </div>
        <div className="body">
          <div id="words">
            <div className="cta">
              {words}
              <BS.Button className={
                classnames(
                  'btn-openstax-primary': not @getUser().isEnrolled(@props.collectionUUID)
                )} onClick={@props.onEnroll}>
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
