{APIActionAdapter} = require 'shared'

{ makeIdRouteData, makeDefaultRequestData,
  createActions, readActions, updateActions, deleteActions,
  actionFrom, createFrom, readFrom, updateFrom, deleteFrom
} = APIActionAdapter

{setUpAPIHandler} = require './adapter'

{ExerciseActions, ExerciseStore} = require '../stores/exercise'
{VocabularyActions, VocabularyStore} = require '../stores/vocabulary'

getIdOnly = (id) ->
  if id.indexOf("@") is -1 then id else id.split("@")[0]

getIdWithVersion = (id, version = 'latest') ->
  if id.indexOf("@") is -1 then "#{id}@#{version}" else id

start = ->
  {updateRequestHandlers, connectTrigger, connectToAPIHandler, connectAsAction} = setUpAPIHandler()

  connectToAPIHandler(
    ExerciseActions,
    readActions,
    readFrom('exercise'),
    (id) ->
      id = getIdWithVersion(id)
      {id}
  )

  connectToAPIHandler(
    ExerciseActions,
    updateActions,
    updateFrom('exercise'),
    (id) ->
      # backend expects the changed props and the entire exercise for some reason
      obj = ExerciseStore.getChanged(id)
      obj.exercise = ExerciseStore.get(id)

      exerciseId = getIdOnly(id)
      {exerciseId}
  )

  connectToAPIHandler(
    ExerciseActions,
    createActions,
    createFrom('exercise'),
    -> null,
    (id) ->
      # backend expects the changed props and the entire exercise for some reason
      data = ExerciseStore.get(id)
      {data}
  )

  connectToAPIHandler(
    ExerciseActions,
    {trigger: 'publish', onSuccess: 'published'},
    actionFrom('publish', 'exercise'),
    (id) ->
      uid = ExerciseStore.getId(id)
      {uid}
    ,
    (id) ->
      # backend expects the changed props and the entire exercise for some reason
      data = ExerciseStore.get(id)
      {data}
  )

  connectToAPIHandler(
    ExerciseActions,
    {trigger: 'deleteAttachment', onSuccess: 'attachmentDeleted'},
    deleteFrom('exercise-attachment'),
    (exerciseUid, attachmentId) -> {exerciseUid, attachmentId}
  )

  connectToAPIHandler(
    VocabularyActions,
    readActions,
    readFrom('vocabulary'),
    (id) ->
      id = getIdWithVersion(id, 'draft')
      {id}
  )

  connectToAPIHandler(
    VocabularyActions,
    createActions,
    createFrom('vocabulary'),
    -> null,
    (id) ->
      data = VocabularyStore.get(id)
      {data}
  )

  connectToAPIHandler(
    VocabularyActions,
    updateActions,
    updateFrom('vocabulary'),
    (id) ->
      id = getIdOnly(id)
      {id}
    ,
    (id) ->
      data = VocabularyStore.get(id)
      {data}
  )

  connectToAPIHandler(
    VocabularyActions,
    {trigger: 'publish', onSuccess: 'published'},
    actionFrom('publish', 'vocabulary'),
    (id) -> VocabularyStore.get(id),
    (id) ->
      data = VocabularyStore.get(id)
      {data}
  )

uploadExerciseImage = (exerciseUid, image, cb) ->
  url = "/api/exercises/#{exerciseUid}/attachments"
  xhr = new XMLHttpRequest()
  xhr.addEventListener 'load', (req) ->
    cb(if req.currentTarget.status is 201
      attachment = JSON.parse(req.target.response)
      ExerciseActions.attachmentUploaded(exerciseUid, attachment)
      {response: attachment, progress: 100}
    else
      {error: req.currentTarget.statusText})
  xhr.addEventListener 'progress', (ev) ->
    cb({progress: (ev.total / (ev.total or image.size) * 100) })
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-CSRF-Token', CSRF_Token)
  form = new FormData()
  form.append("image", image, image.name)
  xhr.send(form)

module.exports = {start, uploadExerciseImage}
