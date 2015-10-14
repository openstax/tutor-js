_ = require 'underscore'
React = require 'react'

{ReferenceBookStore} = require '../../flux/reference-book'
{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
{EcosystemsStore} = require '../../flux/ecosystems'
BindStoreMixin    = require '../bind-store-mixin'
Question          = require '../question'
ExerciseCard      = require './exercise-card'
SpyModeContent    = require '../spy-mode/content'

QAExercises = React.createClass
  propTypes:
    cnxId: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired
    section: React.PropTypes.string.isRequired

  getInitialState: ->
    pageId: 0

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

    <SpyModeContent className="ecosystem-info">
      Page: {@props.cnxId} :: Book: {book.uuid}@{book.version}
    </SpyModeContent>

  render: ->
    content = if ExerciseStore.isLoaded([@state.pageId])
      exercises = ExerciseStore.allForPage(@state.pageId)
      if _.isEmpty(exercises)
        <h3>No exercises found for section {@props.section}</h3>
      else _.map exercises, (ex) -> <ExerciseCard key={ex.id} exercise={ex} />
    else
      <h3>Loading...</h3>

    <div className="page-wrapper">
      <div className="exercises center-panel">
        {content}
        {@renderSpyInfo() if @state.pageId}
      </div>
    </div>

module.exports = QAExercises
