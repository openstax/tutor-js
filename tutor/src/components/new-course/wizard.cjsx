React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'
keys = require 'lodash/keys'
isFunction = require 'lodash/isFunction'
isEmpty = require 'lodash/isEmpty'

TutorRouter = require '../../helpers/router'

BindStoreMixin = require '../bind-store-mixin'
{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{CourseActions, CourseStore} = require '../../flux/course'
{CourseListingStore} = require '../../flux/course-listing'

{OfferingsStore} = require '../../flux/offerings'

CourseOfferingTitle = require './offering-title'
OXFancyLoader = require '../ox-fancy-loader'

STAGES = {
  'course_type':              require './select-type'
  'offering_id':              require './select-course'
  'term':                     require './select-dates'
  'new_or_copy':              require './new-or-copy'
  'cloned_from_id':           require './course-clone'
  'details':                  require './course-details'
  'build':                    require './build-course'
}

STAGE_KEYS = keys(STAGES)

componentFor = (index) ->
  STAGES[ STAGE_KEYS[ index ] ]

NewCourseWizard = React.createClass
  displayName: 'NewCourseWizard'
  propTypes:
    isLoading: React.PropTypes.bool.isRequired
  getInitialState: ->
    currentStage: 0, firstStage: 0

  contextTypes:
    router: React.PropTypes.object

  componentWillMount: ->
    NewCourseActions.initialize(
      TutorRouter.currentParams()
    )
    @setStage()

  setStage: ->
    if STAGES.offering_id.shouldSkip()
      firstStage = 2
    else
      firstStage = if NewCourseStore.canSelectCourseType() then 0 else 1
    @setState({firstStage, currentStage: firstStage})

  componentWillReceiveProps: (nextProps) ->
    # we're switching from loading to not loading
    if @props.isLoading and not nextProps.isLoading
      @setStage()

  mixins: [BindStoreMixin]
  bindStore: NewCourseStore

  onContinue: -> @go(1)
  onBack: -> @go(-1)
  go: (amt) ->
    stage = @state.currentStage
    while componentFor(stage + amt)?.shouldSkip?()
      stage += amt

    @setState({currentStage: stage + amt})

  BackButton: ->
    return null if @state.currentStage is @state.firstStage
    <BS.Button onClick={@onBack} className="back">
      Back
    </BS.Button>

  Footer: ->
    Component = componentFor(@state.currentStage)
    if Component.Footer?
      <Component.Footer course={NewCourseStore.newCourse()}/>
    else
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
    {title} = componentFor(currentStage)
    title = title() if isFunction(title)
    offeringId = NewCourseStore.get('offering_id')

    if currentStage is (STAGE_KEYS.length - 1)
      newCourse = NewCourseStore.newCourse()
      offeringId = newCourse.offering_id if newCourse?

    if offeringId? and currentStage > 1
      <CourseOfferingTitle offeringId={offeringId} >
        {title}
      </CourseOfferingTitle>
    else
      <div>{title}</div>

  onCancel: ->
    NewCourseActions.reset()
    @context.router.transitionTo('/dashboard')

  render: ->
    {isLoading} = @props
    isBuilding = NewCourseStore.isBuilding()

    Component = componentFor(@state.currentStage)

    wizardClasses = classnames('new-course-wizard', STAGE_KEYS[@state.currentStage],
      'is-loading': isLoading or isBuilding
      'is-building': isBuilding
    )

    <BS.Panel
      header={<@Title />}
      className={wizardClasses}
      footer={<@Footer />}
    >
      <div className='panel-content'>
        <OXFancyLoader isLoading={isLoading or isBuilding}/>
        {<Component/> unless isLoading}
      </div>
    </BS.Panel>


module.exports = NewCourseWizard
