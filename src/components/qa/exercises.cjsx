_ = require 'underscore'
BS = require 'react-bootstrap'
React = require 'react'
{SpyMode} = require 'openstax-react-components'

{ReferenceBookStore} = require '../../flux/reference-book'
{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
{EcosystemsStore} = require '../../flux/ecosystems'

String         = require '../../helpers/string'
BindStoreMixin = require '../bind-store-mixin'
Question       = require '../question'
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
      ExerciseActions.load(@props.ecosystemId, [page.id], '')

  renderSpyInfo: ->
    book = EcosystemsStore.getBook(@props.ecosystemId)
    <SpyMode.Content className="ecosystem-info">
      Page: {@props.cnxId} :: Book: {book.uuid}@{book.version}
    </SpyMode.Content>

  onSelectPoolType: (selection) ->
    ignored = _.clone(@state.ignored)
    ignored[selection.id] = not ignored[selection.id]
    @setState({ignored})

  renderExerciseContent: (exercises) ->
    exercises = _.map exercises, (ex) =>
      return null if _.every( ExerciseStore.poolTypes(ex), (pt) => @state.ignored[pt] )
      <ExerciseCard key={ex.id} exercise={ex} ignoredPoolTypes={@state.ignored} />
    selections = _.map ExerciseStore.getPagePoolTypes(@state.pageId), (pt) =>
      id: pt, title: String.titleize(pt), selected: not @state.ignored[pt]

    <div className="-exercises">
      <MultiSelect className="pull-right"
        title='Exercise Types'
        selections={selections}
        onSelect={@onSelectPoolType} />
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
