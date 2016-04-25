history = require 'history'
_ = require 'underscore'

{ExerciseActions, ExerciseStore} = require 'stores/exercise'
{VocabularyActions, VocabularyStore} = require 'stores/vocabulary'

VIEWS =
  exercises:
    Body:     require 'components/exercise'
    Controls: require 'components/exercise/controls'
    store:    ExerciseStore
    actions:  ExerciseActions

  search:
    Body:     require 'components/search'
    Controls: require 'components/search/controls'

  vocabulary:
    Body:     require 'components/vocabulary'
    Controls: require 'components/vocabulary/controls'
    store:    VocabularyStore
    actions:  VocabularyActions

# The Location class pairs urls with components and stores
class Location

  constructor: ->
    @history = history.createHistory()

  startListening: (cb) ->
    @historyUnlisten = @history.listen(cb)

  stopListening: ->
    @historyUnlisten()

  visitNewRecord: (type) ->
    @history.push("/#{type}/new")

  visitSearch: ->
    @history.push('/search')

  visitExercise: (id) ->
    @history.push("/exercises/#{id}")

  getCurrentUrlParts: ->
    path = window.location.pathname
    [view, id, args...] = _.tail path.split('/')
    {view, id, args}

  partsForView: (view = @getCurrentUrlParts().view) ->
    VIEWS[view] or VIEWS['search']


module.exports = Location
