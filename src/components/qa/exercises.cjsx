React = require 'react'
{ReferenceBookStore} = require '../../flux/reference-book'
ReferenceBookPage = require '../reference-book/page-shell'
{ExerciseStore, ExerciseActions} = require '../../flux/exercise'
BindStoreMixin = require '../bind-store-mixin'
TaskStep = require '../task-step'
ArbitraryHtml = require '../html'
Question = require '../question'

{ReferenceBookExercise} =  require '../reference-book/exercise'

{Reading, Exercise } = require '../task-step/all-steps'

QAExercises = React.createClass
  propTypes:
    cnxId: React.PropTypes.string.isRequired
    ecosystemId: React.PropTypes.string.isRequired

  getInitialState: ->
    pageId: 0

  mixins: [BindStoreMixin]
  bindStore: ExerciseStore

  componentWillMount: ->
    page = ReferenceBookStore.getPageInfo(@props)
    @setState(pageId: page.id)
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
