React = require 'react'
BS = require 'react-bootstrap'
{RouteHandler} = require 'react-router'

{EcosystemsStore, EcosystemsActions} = require '../../flux/ecosystems'
{ExerciseActions} = require '../../flux/exercise'
{TocStore, TocActions} = require '../../flux/toc'

QuestionsList = require './questions-list'
BackButton = require '../buttons/back-button'
SectionsChooser = require '../sections-chooser'
BindStore = require '../bind-store-mixin'
Icon = require '../icon'
LoadingDisplay = require './loading-display'

HELPTOOLTIP = '''
    Tutor uses these questions for your assignments,
    spaced practice, personalization, and Performance Forecast practice.
'''

QuestionsDashboard = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired

  getInitialState: -> {}
  showQuestions: ->
    ExerciseActions.load( @props.courseId, @state.sectionIds, '' )
    @setState(displayingIds: @state.sectionIds)

  clearQuestions: -> @replaceState({sectionIds: []})
  onSectionChange: (sectionIds) -> @setState({sectionIds})


  render: ->
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
          <Icon type='question-circle' tooltip={HELPTOOLTIP} />
        </div>
      </div>

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

      <QuestionsList helpTooltip={HELPTOOLTIP} {...@props}
        sectionIds={@state.displayingIds} />

    </div>

module.exports = QuestionsDashboard
