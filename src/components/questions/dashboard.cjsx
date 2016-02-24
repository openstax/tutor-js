React = require 'react'
BS = require 'react-bootstrap'
{RouteHandler} = require 'react-router'

{EcosystemsStore, EcosystemsActions} = require '../../flux/ecosystems'

{TocStore, TocActions} = require '../../flux/toc'
BackButton = require '../buttons/back-button'
SectionsChooser = require '../sections-chooser'
BindStore = require '../bind-store-mixin'
Icon = require '../icon'
ChapterQuestions = require './chapter-questions'

HELPTOOLTIP = '''
    Tutor uses these questions for your assignments,
    spaced practice, personalization, and Performance Forecast practice.
'''

QuestionsDashboard = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired

  getInitialState: -> {}
  onSectionChange: (sectionIds) ->
    @setState({sectionIds})

  showQuestions: ->
    @setState({isShowingQuestions: true})

  renderQuestions: ->
    selected = TocStore.groupSectionIdsByChapter(@props.ecosystemId, @state.sectionIds)
    for chapterId, sectionIds of selected
      <ChapterQuestions key={chapterId} chapterId={chapterId} sectionIds={sectionIds} />

  render: ->

    <div className="questions-dashboard">

      <div className="header">
        <h2>Question Library</h2>
        <BackButton fallbackLink={
          text: 'Back to Dashboard', to: 'viewTeacherDashBoard', params: {courseId: @props.courseId}
        }/>
      </div>
      <div className="instructions">
        Select sections below to review and exclude questions from your students’ experience.
        <Icon type='question-circle' tooltip={HELPTOOLTIP} />
      </div>
      <div className="sections">
        <SectionsChooser
          onSelectionChange={@onSectionChange}
          ecosystemId={@props.ecosystemId}
          chapters={TocStore.get(@props.ecosystemId)}
        />
      </div>

      <div className='actions'>
        <BS.Button bsStyle='primary'
          disabled={_.isEmpty(@state.sectionIds)}
          onClick={@showQuestions}
        >
          Show Questions
        </BS.Button>
      </div>

      {@renderQuestions() if @state.isShowingQuestions}

    </div>

module.exports = QuestionsDashboard
