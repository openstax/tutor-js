_     = require 'underscore'
BS    = require 'react-bootstrap'
React = require 'react'

{ExerciseActions} = require '../../flux/exercise'
{TocStore, TocActions} = require '../../flux/toc'

BackButton = require '../buttons/back-button'
Chooser = require '../sections-chooser'

Icon = require '../icon'

QLSectionsChooser = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired
    onSelectionsChange: React.PropTypes.func.isRequired

  getInitialState: -> {}

  showQuestions: ->
    ExerciseActions.loadForCourse( @props.courseId, @state.sectionIds, null, '' )
    @props.onSelectionsChange(@state.sectionIds)

  clearQuestions: ->
    @replaceState({sectionIds: []})
    @props.onSelectionsChange([])

  onSectionChange: (sectionIds) -> @setState({sectionIds})

  render: ->
    <div className="sections-chooser panel">

      <div className="header">
        <div className="wrapper">
          <h2>Question Library</h2>
          <BackButton fallbackLink={
            text: 'Back to Dashboard', to: 'viewTeacherDashBoard', params: {courseId: @props.courseId}
          }/>
        </div>
      </div>

      <div className="sections-list">
        <Chooser
          onSelectionChange={@onSectionChange}
          selectedSectionIds={@state.sectionIds}
          ecosystemId={@props.ecosystemId}
          chapters={TocStore.get(@props.ecosystemId)}
        />
      </div>

      <div className='section-controls panel-footer'>
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

    </div>

module.exports = QLSectionsChooser
