React = require 'react'
BS = require 'react-bootstrap'
{RouteHandler} = require 'react-router'

{CourseStore} = require '../../flux/course'
{ExerciseActions} = require '../../flux/exercise'
{TocStore, TocActions} = require '../../flux/toc'

QuestionsList = require './questions-list'
BackButton = require '../buttons/back-button'
SectionsChooser = require '../sections-chooser'
BindStore = require '../bind-store-mixin'
Icon = require '../icon'
LoadingDisplay = require './loading-display'

CC_HELP = '''
By default, Concept Coach will use all questions in the Library
to deliver practice questions to your students.
The Library gives you the option to exclude questions from your
students' experiences. However, please note that you will
not be able to exclude questions from assignments or
scores once your students start using Concept Coach.
'''

CC_SECONDARY_HELP = <div className="secondary-help">
  <b>Best Practice:</b>
  Exclude desired questions <u>before</u> giving students access to Concept Coach.
</div>

TUTOR_HELP = '''
    Tutor uses these questions for your assignments,
    spaced practice, personalization, and Performance Forecast practice.
'''

QuestionsDashboard = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired

  contextTypes:
    router: React.PropTypes.func

  getInitialState: -> {}

  componentWillMount: ->
    selectedSections = @context.router.getCurrentQuery()['sid']?.split('-')
    if selectedSections
      @setState(sectionIds: selectedSections, displayingIds: selectedSections)
      ExerciseActions.loadForCourse( @props.courseId, selectedSections, '' )

  showQuestions: ->
    ExerciseActions.loadForCourse( @props.courseId, @state.sectionIds, '' )
    @context.router.transitionTo('viewQuestionsLibrary',
      {courseId: @props.courseId},
      {sid: @state.sectionIds.join('-')}
    )

  clearQuestions: -> @replaceState({sectionIds: []})
  onSectionChange: (sectionIds) -> @setState({sectionIds})

  render: ->
    course = CourseStore.get(@props.courseId)

    helpText = if course.is_concept_coach then CC_HELP else TUTOR_HELP
    secondaryHelp = if course.is_concept_coach then CC_SECONDARY_HELP else null

    <div className="questions-dashboard">
      <LoadingDisplay chapterIds={@state.chapterIds} sectionIds={@state.sectionIds} />
      <div className="header">
        <div className="wrapper">
          <h2>Question Library</h2>
          <BackButton fallbackLink={
            text: 'Back to Dashboard', to: 'viewTeacherDashBoard', params: {courseId: @props.courseId}
          }/>
        </div>
      </div>
      <div className="instructions">
        <div className="wrapper">
          Select sections below to review and exclude questions from your
           students’ experience.
          <Icon type='info-circle' tooltip={helpText} />
        </div>
      </div>
      {secondaryHelp}
      <div className="sections-list">
        <SectionsChooser
          onSelectionChange={@onSectionChange}
          selectedSectionIds={@state.sectionIds}
          ecosystemId={@props.ecosystemId}
          chapters={TocStore.get(@props.ecosystemId)}
        />
      </div>

      <div className='section-controls'>
        <div className='wrapper'>
          <BS.Button bsStyle='primary'
            disabled={_.isEmpty(@state.sectionIds)}
            onClick={@showQuestions}
          >
            Show Questions
          </BS.Button>
          <BS.Button onClick={@clearQuestions}>Cancel</BS.Button>
        </div>
      </div>

      <QuestionsList helpTooltip={helpText} {...@props}
        sectionIds={@state.displayingIds} />

    </div>

module.exports = QuestionsDashboard
