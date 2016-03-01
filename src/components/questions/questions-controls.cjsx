React = require 'react'
BS = require 'react-bootstrap'
cn = require 'classnames'

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
  getScrollTopOffset: -> 120 # 70px high control bar and 50px spacing for label

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
    index = @scrollIndex(sections)
    @scrollToSection(
      sections[ if index < sections.length then index + 1 else sections.length - 1]
    )

  scrollIndex: (sections = @getSections() ) ->
    sections.indexOf(@state.scrollPosition)


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
    console.log
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
      <div className="sectionizer">
        <div
          className={cn('prev', disabled: 0 is @scrollIndex())}
          onClick={@goBack}>❮</div>
        {for section in sections
          <div key={section}
            onClick={_.partial(@scrollToSection, section)}
            className={'active' if @state.scrollPosition is section}
          >{section}</div>}
        <div className="next"
          onClick={_.partial(@scrollToSection, section)}
          className={cn('next', disabled: _.keys(@props.exercises.all.grouped).length - 1 is @scrollIndex())}
          onClick={@goNext}>❯</div>
      </div>
      <div className="save-cancel">
        {@renderSaveCancelButtons() if ExerciseStore.hasUnsavedExclusions()}
      </div>
    </div>



module.exports = QuestionsControls
