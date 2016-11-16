React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'
keys = require 'lodash/keys'

TutorRouter = require '../../helpers/router'

BindStore = require '../bind-store-mixin'
{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{CourseActions, CourseStore} = require '../../flux/course'
{OfferingsStore} = require '../../flux/offerings'
CourseInformation = require '../../flux/course-information'

CourseOffering = require './offering'

STAGES = {
  'course_type':              require './select-type'
  'offering_id':              require './select-course'
  'term':                     require './select-dates'
  'details':                  require './course-details'
  'copy_question_library':    require './copy-ql'
  'build':                    require './build-course'
}

STAGE_KEYS = keys(STAGES)

componentFor = (index) ->
  STAGES[ STAGE_KEYS[ index ] ]

NewCourse = React.createClass

  getInitialState: ->
    currentStage: 0

  contextTypes:
    router: React.PropTypes.object

  componentWillMount: ->
    if TutorRouter.currentQuery()?.courseId
      course = CourseStore.get(TutorRouter.currentQuery()?.courseId)
      NewCourseActions.setClone(course)
      @setState({currentStage: 2})

  mixins: [BindStore]
  bindStore: NewCourseStore

  onContinue: -> @go(1)
  onBack: -> @go(-1)
  go: (amt) ->
    stage = @state.currentStage
    while componentFor(stage + amt)?.shouldSkip?()
      stage += amt
    @setState({currentStage: stage + amt})

  BackButton: ->
    return null if @state.currentStage is 0
    <BS.Button onClick={@onBack} className="back"
      disabled={@state.currentStage is 0}
    >
      Back
    </BS.Button>

  Footer: ->
    <div className="controls">
      <BS.Button
        onClick={@onCancel} className="cancel"
      >
        Cancel
      </BS.Button>

      <@BackButton />

      <BS.Button onClick={@onContinue}
        bsStyle='primary' className="next"
        disabled={
          not NewCourseStore.isValid( STAGE_KEYS[@state.currentStage] )
        }
      >
        Continue
      </BS.Button>

    </div>

  Title: ->
    {currentStage} = @state
    Component = componentFor(currentStage)
    offeringId = NewCourseStore.get('offering_id')

    if offeringId? and currentStage > 1
      <CourseOffering offeringId={offeringId} >
        {Component.title}
      </CourseOffering>
    else
      <div>{Component.title}</div>

  onCancel: ->
    @context.router.transitionTo('/dashboard')

  render: ->
    Component = componentFor(@state.currentStage)

    <BS.Panel
      header={<@Title />}
      className={"new-course-wizards-#{STAGE_KEYS[@state.currentStage]}"}
      footer={<@Footer /> unless Component.shouldHideControls}
    >
        <Component
          onContinue={@onContinue}
          onCancel={@onCancel}
          {...@state}
        />
    </BS.Panel>


module.exports = NewCourse
