_ = require 'underscore'
React = require 'react'

{ReferenceBookStore} = require '../../flux/reference-book'
ReferenceBookPage = require '../reference-book/page-shell'
{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
BindStoreMixin = require '../bind-store-mixin'

Question = require '../question'

{ReferenceBookExercise} =  require '../reference-book/exercise'

QAExercises = React.createClass
  propTypes:
    cnxId: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired

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
    if page and _.isEmpty( ExerciseStore.allForPage(page.id) )
      ExerciseActions.load(@props.ecosystemId, [page.id], '')

  renderExercise: (exercise) ->
    <Question key={exercise.id} model={exercise.content.questions[0]}/>

  render: ->
    <div className="page-wrapper">
      <div className="exercises center-panel">
        {_.map ExerciseStore.allForPage(@state.pageId), @renderExercise}
      </div>
    </div>

module.exports = QAExercises
