React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
partial = require 'lodash/partial'
includes = require 'lodash/includes'
map = require 'lodash/map'
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

SemesterIsPast = (props) ->
  <div className="fine-print switch">
    <p>
      <a role="button" onClick={props.onEnrollSecondSemester}>Register for the new semester</a>
    </p>
  </div>

Enroll = (props) ->
  <BS.Button className='btn-openstax-primary' onClick={props.onEnroll}>
    Enroll in This Course
  </BS.Button>

Launch = (props) ->
  <BS.Button bsStyle='default' onClick={props.onLaunch}>
    Launch Concept Coach
  </BS.Button>


Launcher = React.createClass
  displayName: 'Launcher'
  propTypes:
    isLaunching: React.PropTypes.bool
    defaultHeight: React.PropTypes.number
    onLogin: React.PropTypes.func.isRequired
    onEnroll: React.PropTypes.func.isRequired
    onLaunch: React.PropTypes.func.isRequired
    onEnrollSecondSemester: React.PropTypes.func.isRequired
    collectionUUID: React.PropTypes.string.isRequired
    enrollmentCode: React.PropTypes.string
    setIsEnrollmentCodeValid: React.PropTypes.func

  getDefaultProps: ->
    isLaunching: false
    defaultHeight: 388
  getInitialState: ->
    height: @getHeight()
    isEnrollmentCodeValid: false
    isEnrollmentTargetPast: false
    isCoursePast: false

  componentWillReceiveProps: (nextProps) ->
    @setState(height: @getHeight(nextProps)) if @props.isLaunching isnt nextProps.isLaunching

  componentWillMount: ->
    if @props.enrollmentCode? and not @getUser().isEnrolled(@props.collectionUUID, @props.enrollmentCode)
      @validateEnrollmentCode()

  validateEnrollmentCode: ->
    {enrollmentCode} = @props
    course = @getCourse()
    course.channel.once('validated.*', partial(@setIsEnrollmentCodeValid, course.channel))
    course.validate(enrollmentCode)

  setIsEnrollmentCodeValid: (eventChannel, data) ->
    if eventChannel.event is 'validated.failure'
      if includes(map(data, 'code'), 'course_ended')
        @setState(isEnrollmentTargetPast: true)
        if @getUser().getCourse(@props.collectionUUID).id is @getUser().getCourse(@props.collectionUUID, @props.enrollmentCode)?.id
          @setState(isCoursePast: true)
    else if eventChannel.event is 'validated.success'
      @props.setIsEnrollmentCodeValid?(true)
      @setState(isEnrollmentCodeValid: true)

  isEnrolled: ->
    {enrollmentCode} = @props if not @state.isEnrollmentTargetPast and @state.isEnrollmentCodeValid
    @getUser().isEnrolled(@props.collectionUUID, enrollmentCode)

  mixins: [UserStatusMixin]

  getHeight: (props) ->
    props ?= @props
    {isLaunching, defaultHeight} = props
    if isLaunching then window.innerHeight else defaultHeight

  render: ->
    {isLaunching, defaultHeight} = @props
    {height, isEnrollmentCodeValid, isCoursePast} = @state
    user = @getUser()
    isEnrolled =  @isEnrolled()
    isLoggedIn = user.isLoggedIn()

    finePrint = if isEnrolled
      if isCoursePast
        <SemesterIsPast {...@props}/>
      else
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
        'is-enrolled': isEnrolled
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
              {if isEnrolled then <Launch {...@props}/> else <Enroll {...@props} />}
            </div>
            {finePrint}
          </div>
          <CoachGraphic {...@props} />
        </div>
      </div>
    </div>


module.exports = Launcher
