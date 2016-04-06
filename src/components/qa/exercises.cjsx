_ = require 'underscore'
BS = require 'react-bootstrap'
React = require 'react'
classnames = require 'classnames'
{SpyMode} = require 'openstax-react-components'

{ReferenceBookStore} = require '../../flux/reference-book'
{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
{EcosystemsStore} = require '../../flux/ecosystems'

String         = require '../../helpers/string'
BindStoreMixin = require '../bind-store-mixin'
ExerciseCard   = require './exercise-card'
MultiSelect    = require '../multi-select'

QAExercises = React.createClass
  propTypes:
    cnxId: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired
    section: React.PropTypes.string.isRequired

  getInitialState: ->
    pageId: 0, ignored: {}

  mixins: [BindStoreMixin]
  bindStore: ExerciseStore

  componentWillMount: ->
    @loadPage(@props)

  componentWillReceiveProps: (nextProps) ->
    if nextProps.cnxId isnt @props.cnxId
      @loadPage(nextProps)

  loadPage: (props) ->
    page = ReferenceBookStore.getPageInfo(props)
    @setState(pageId: page.id)
    if page and not ExerciseStore.isLoaded([page.id])
      ExerciseActions.loadForEcosystem(@props.ecosystemId, [page.id], '')

  renderSpyInfo: ->
    book = EcosystemsStore.getBook(@props.ecosystemId)
    <SpyMode.Content className="ecosystem-info">
      Page: {@props.cnxId} :: Book: {book.uuid}@{book.version}
    </SpyMode.Content>

  onSelectType: (selection) ->
    ignored = _.clone(@state.ignored)
    ignored[selection.id] = not ignored[selection.id]
    @setState({ignored})

  on2StepPreviewChange: (ev) ->
    @setState(isShowing2StepPreview: ev.target.checked)

  renderExerciseContent: (exercises) ->
    exercises = _.map exercises, (exercise) =>
      <ExerciseCard key={exercise.id}
        exercise={exercise}
        show2StepPreview={@state.isShowing2StepPreview}
        ignoredTypes={@state.ignored} />

    selections = _.map ExerciseStore.getPageExerciseTypes(@state.pageId), (pt) =>
      id: pt, title: String.titleize(pt), selected: not @state.ignored[pt]
    classNames = classnames("exercises", {
      'show-2step': @state.isShowing2StepPreview
    })
    <div className={classNames} >
      <div className="heading">
        <label>
          Show 2-Step Preview
          <input type='checkbox'
            className='preview2step'
            checked={@state.isShowing2StepPreview}
            onChange={@on2StepPreviewChange} />
        </label>
        <MultiSelect
          title='Exercise Types'
          selections={selections}
          onSelect={@onSelectType} />

      </div>
      {exercises}
    </div>

  render: ->
    content = if ExerciseStore.isLoaded([@state.pageId])
      exercises = ExerciseStore.allForPage(@state.pageId)
      if _.isEmpty(exercises)
        <h3>No exercises found for section {@props.section}</h3>
      else
        @renderExerciseContent(exercises)
    else
      <h3>Loading...</h3>

    <div className="page-wrapper">
      <div className="exercises center-panel">
        {content}
        {@renderSpyInfo() if @state.pageId}
      </div>
    </div>

module.exports = QAExercises
