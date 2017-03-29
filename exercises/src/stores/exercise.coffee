_ = require 'underscore'
find = require 'lodash/find'
map = require 'lodash/map'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{QuestionActions, QuestionStore} = require './question'
TaggingMixin = require './tagging-mixin'

cascadeLoad = (obj, exerciseId) ->
  for question in obj.questions
    QuestionActions.loaded(question, question.id)
  obj

EmptyFn = -> ''

multipartCache = {}

ExerciseConfig = {
  _loaded: (obj, exerciseId) ->
    cascadeLoad(obj, exerciseId)
    @emit('loaded', exerciseId)

  _asyncStatusPublish: {}

  updateStimulus: (id, stimulus_html) -> @_change(id, {stimulus_html})

  sync: (id) ->
    questions = map @_local[id].questions, (question) ->
      QuestionActions.syncAnswers(question.id)
      QuestionStore.get(question.id)
    @_change(id, {questions})

  save: (id) ->
    @sync(id)
    @_save(id)

  published: (obj, id) ->
    @emit('published', id)
    @saved(obj, id)

  _saved: (obj, id) ->
    cascadeLoad(obj, id)
    @_asyncStatusPublish[id] = false
    @emit('updated', obj.id)

  _created:(obj, id) ->
    cascadeLoad(obj, obj.number)
    obj.id = obj.number
    @emit('created', obj.id)
    @emit('updated', obj.id)
    obj

  setAsVocabularyPlaceHolder: (id, newVocabId) ->
    @_change(id, {vocab_term_uid: newVocabId})

  publish: (id) ->
    @_asyncStatusPublish[id] = true
    @emitChange()

  deleteAttachment: EmptyFn

  attachmentDeleted: (resp, id, attachmentFilename) ->
    exercise = @_local[id]
    exercise.attachments = _.reject(exercise.attachments, (attachment) ->
      attachment.asset.filename is attachmentFilename)
    @emitChange()

  addQuestionPart: (id) ->
    { questions } = @_get(id)

    newId = QuestionStore.freshLocalId()
    template = _.extend({}, QuestionStore.getTemplate(), {id: newId})
    QuestionActions.loaded(template, newId)
    question = QuestionStore.get(newId)

    @_local[id].questions.push(question)
    @sync(id)

  toggleMultiPart: (id) ->
    { questions } = @_get(id)

    if (@_local[id].questions.length > 1)
      multipartCache[id] = questions
      newQuestions = [_.first(questions)]
    else if (multipartCache[id])
      newQuestions = multipartCache[id]
      multipartCache[id] = null
    else
      return @addQuestionPart(id)

    @_local[id].questions = newQuestions
    @sync(id)

  removeQuestion: (id, questionId) ->
    { questions } = @_get(id)

    newQuestions = _.filter(questions, (question) -> question.id isnt questionId)
    if (newQuestions.length is 0)
      @_local[id].questions = []
      @addQuestionPart(id)
    else
      @_local[id].questions = newQuestions
      @sync(id)

  moveQuestion: (id, questionId, direction) ->
    { questions } = @_get(id)
    index = _.findIndex questions, (question) ->
      question.id is questionId

    if (index isnt -1)
      temp = questions[index]
      questions[index] = questions[index + direction]
      questions[index + direction] = temp
      @_local[id].questions = questions
      @sync(id)


  attachmentUploaded: (id, attachment) ->
    exercise = @_local[id]
    exercise.attachments ||= []
    exercise.attachments.push(attachment)
    @emitChange()

  createBlank: (id) ->
    template = @exports.getTemplate.call(@)
    @loaded(template, id)

  exports:
    getQuestions: (id) -> @_get(id).questions

    isMultiPart: (id) -> @_get(id)?.questions.length > 1

    isVocabQuestion: (id) -> @_get(id)?.is_vocab

    getVocabId: (id) -> @_get(id)?.vocab_term_uid

    getId: (id) -> @_get(id).uid

    getNumber: (id) -> @_get(id).number

    getStimulus: (id) -> @_get(id).stimulus_html

    getPublishedDate: (id) -> @_local[id].published_at

    isPublished: (id) -> !!@_get(id)?.published_at

    isPublishing: (id) -> !!@_asyncStatusPublish[id]

    isValid: (id) -> @exports.validate.call(@, id).valid

    isSavedOrSavable: (id) ->
      @exports.isValid.call(@, id) and
        not @exports.isSaving.call(@, id) and
        not @exports.isPublishing.call(@, id)

    isSavable: (id) ->
      @exports.isChanged.call(@, id) and
        @exports.isSavedOrSavable.call(@, id)

    isPublishable: (id) ->
      @exports.isSavedOrSavable.call(@, id) and
        not @exports.isChanged.call(@, id) and
        not @_get(id)?.published_at

    isMissingExercise: (error, id) ->
      if error.status is 404
        @FAILED(error.status, error.statusMessage, id)
        true

    getTemplate: (id) ->
      questionId = QuestionStore.freshLocalId()

      tags: []
      stimulus_html:"",
      questions:[_.extend({}, QuestionStore.getTemplate(), {id: questionId})]

    canEdit: (id, user) ->
      exercise = @_get(id)
      !!find( exercise.authors, user_id: user.id )

    validate: (id) ->
      return {valid: false, part: 'exercise'} unless @_local[id]
      _.reduce @_local[id].questions, (memo, question) ->
        validity = QuestionStore.validate(question.id)

        valid: memo.valid and validity.valid
        part: memo.part or validity.part
      , valid: true

}

TaggingMixin.extend(ExerciseConfig)

extendConfig(ExerciseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ExerciseConfig)

module.exports = {ExerciseActions:actions, ExerciseStore:store}
