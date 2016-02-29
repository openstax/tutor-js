React = require 'react'
BS = require 'react-bootstrap'

{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
{PinnedHeader} = require 'openstax-react-components'
Icon = require '../icon'
ScrollTo = require '../scroll-to-mixin'

QuestionsControls = React.createClass

  mixins: [ScrollTo]
  propTypes:
    exercises: React.PropTypes.shape(
      all: React.PropTypes.object
      homework: React.PropTypes.object
      reading: React.PropTypes.object
    ).isRequired
    selectedExercises: React.PropTypes.array
    filter: React.PropTypes.string
    onFilterChange: React.PropTypes.func.isRequired
  scrollingTargetDOM: -> window.document
  getInitialState: ->
    {scrollingTo: _.first(@getSections())}

  scrollToSection: (section) ->
    @setState({scrollingTo: section})
    @scrollToSelector("[data-section='#{section}']")

  componentWillMount: ->
    @setState(scrollPosition: @props.exerciseGroups)

  componentDidMount: ->
    @scrollToSelector(".questions-list")

  onAfterScroll: ->
    @setState({scrollingTo: null, scrollPosition: @state.scrollingTo})

  getSections: ->
    (cs.split(',').join('.') for cs, sections of @props.exercises.all.grouped)

  goBack: ->
    sections = @getSections()
    index = sections.indexOf(@state.scrollPosition)
    @scrollToSection(sections[ if index > 1 then index - 1 else 0])

  goNext: ->
    sections = @getSections()
    index = sections.indexOf(@state.scrollPosition)
    @scrollToSection(
      sections[ if index < sections.length then index + 1 else sections.length - 1]
    )

  onFilterClick: (ev) ->
    filter = ev.currentTarget.getAttribute('data-filter')
    if filter is @props.filter then filter = ''
    @props.onFilterChange( filter )

  resetExclusions: ->
    ExerciseActions.resetUnsavedExclusions()

  renderSaveCancelButtons: ->
    [
        <BS.Button key='save' bsStyle='primary' className="save">Save</BS.Button>
        <BS.Button key='cancel' className="cancel" onClick={@resetExclusions}>Cancel</BS.Button>
    ]

  render: ->
    sections = @getSections()
    selected = @props.selectedSection or _.first(sections)
    <div className="questions-controls">
      <BS.ButtonGroup key='filters'>
        <BS.Button data-filter='reading' onClick={@onFilterClick}
          className={if @props.filter is 'reading' then 'reading active' else 'reading'}
        >
          Reading <span className="count">({@props.exercises.reading.count})</span>
        </BS.Button>
        <BS.Button data-filter='homework' onClick={@onFilterClick}
          className={if @props.filter is 'homework' then 'homework active' else 'homework'}
        >
          Practice <span className="count">({@props.exercises.homework.count})</span>
        </BS.Button>
      </BS.ButtonGroup>
      <div className="section-selection">
        <div className="prev" onClick={@goBack}>❮</div>
        {for section in sections
          <div key={section}
            onClick={_.partial(@scrollToSection, section)}
            className={'active' if @state.scrollPosition is section}
          >{section}</div>}
        <div className="next" onClick={@goNext}>❯</div>
      </div>
      <div className="save-cancel">
        {@renderSaveCancelButtons() if ExerciseStore.hasUnsavedExclusions()}
      </div>
    </div>


module.exports = QuestionsControls
