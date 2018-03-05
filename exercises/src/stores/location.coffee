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

  # search:
  #   Body:     require 'components/search'
  #   Controls: require 'components/search/controls'

  vocabulary:
    Body:     require 'components/vocabulary'
    Controls: require 'components/vocabulary/controls'
    store:    ExerciseStore
    actions:  ExerciseActions

  view:
    Body:     require 'components/preview'
    Controls: require 'components/preview/controls'
    store:    ExerciseStore
    actions:  ExerciseActions

# The Location class pairs urls with components and stores
class Location

  constructor: ->
    @_createHistory()

  _createHistory: ->
    @history = history.createBrowserHistory()

  startListening: (cb, @user) ->
    @historyUnlisten = @history.listen(cb)

  stopListening: ->
    @historyUnlisten()

  visitNewRecord: (type) ->
    @history.push("/#{type}/new")

  visitSearch: ->
    @history.push('/search')

  visitExercise: (id) ->
    @history.push("/exercises/#{id}")

  visitVocab: (id) ->
    @history.push("/vocabulary/#{id}")

  visitPreview: (id) ->
    @history.push("/view/#{id}")

  getCurrentUrlParts: ->
    path = window.location.pathname
    [view, id, args...] = _.tail path.split('/')
    {view, id, args}

  partsForView: (view = @getCurrentUrlParts().view) ->
    VIEWS[view] or VIEWS['search']

  # callback for when a record is newly loaded from store
  # Location may choose to redirect to a different editor depending on the data
  onRecordLoad: (type, id, store) ->

    {view} = @getCurrentUrlParts()
    record = store.get(id)
    if record and not store.canEdit(id, @user)
      @visitPreview(id)
    else
      # use vocab editor
      if type is 'exercises' and record.vocab_term_uid
        @visitVocab(id) #record.vocab_term_uid)
      else
        @history.push("/#{type}/#{id}")

module.exports = Location
