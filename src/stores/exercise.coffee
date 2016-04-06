_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{QuestionActions, QuestionStore} = require './question'

cascadeLoad = (obj, exerciseId) ->
  for question in obj.questions
    QuestionActions.loaded(question, question.id)
  obj

EmptyFn = -> ''

ExerciseConfig = {
  _loaded: cascadeLoad
  _asyncStatusPublish: {}

  updateNumber: (id, number) -> @_change(id, {number})

  updateStimulus: (id, stimulus_html) -> @_change(id, {stimulus_html})

  addBlankPrefixedTag: (id, {prefix}) ->
    prefix += ':'
    tags = _.clone( @_get(id).tags )
    # is there already a blank one?
    unless _.find( tags, (tag) -> tag is prefix )
      tags.push(prefix)
      @_change(id, {tags})

  # Updates or creates a prefixed tag
  # If previous is given, then only the tag with that value will be updated
  # Otherwise it will be added (unless it exists)
  # If replaceOthers is set, all others will prefix will be removed
  setPrefixedTag: (id, {prefix, tag, tags, previous, replaceOthers}) ->
    prefix += ':'
    if tags
      tags = _.reject(@_get(id).tags, (tag) -> 0 is tag.indexOf(prefix))
        .concat( _.map tags, (tag) -> prefix + tag )
    else if replaceOthers
      tags = _.reject @_get(id).tags, (tag) -> 0 is tag.indexOf(prefix)
    else
      tags = _.clone @_get(id).tags

    if previous?
      tags = _.reject tags, (tag) -> tag is prefix + previous

    if tag and not _.find(tags, (tag) -> tag is prefix + tag)
      tags.push(prefix + tag)

    @_change(id, {tags})


  sync: (id) ->
    questions = _.map @_local[id].questions, (question) ->
      QuestionActions.syncAnswers(question.id)
      QuestionStore.get(question.id)
    @_change(id, {questions})

  save: (id) ->
    @sync(id)
    @_save(id)

  _saved: (obj, id) ->
    cascadeLoad(obj, id)
    @_asyncStatusPublish[id] = false
  created:(obj, id) ->
    @emit('created', obj.uid)

  publish: (id) ->
    @_asyncStatusPublish[id] = true
    @emitChange()

  deleteAttachment: EmptyFn

  attachmentDeleted: (resp, exerciseUid, attachmentId) ->
    exercise = _.findWhere(@_local, {uid: exerciseUid})
    exercise.attachments = _.reject exercise.attachments, (attachment) -> attachment.id is attachmentId
    @emitChange()

  addQuestionPart: (id) ->
    @_local[id].questions.push({})

    @emitChange()


  attachmentUploaded: (uid, attachment) ->
    exercise = _.findWhere(@_local, {uid})
    exercise.attachments ||= []
    exercise.attachments.push(attachment)
    @emitChange()

  exports:
    getQuestions: (id) -> @_local[id].questions

    getId: (id) -> @_local[id].uid

    getNumber: (id) -> @_local[id].number

    getStimulus: (id) -> @_local[id].stimulus_html

    getPublishedDate: (id) -> @_local[id].published_at

    isPublished: (id) -> @_local[id].published_at

    isPublishing: (id) -> !!@_asyncStatusPublish[id]

    getTagsWithPrefix: (id, prefix) ->
      prefix += ':'
      tags = _.select @_get(id).tags, (tag) -> 0 is tag.indexOf(prefix)
      _.map( tags, (tag) -> tag.replace(prefix, '') ).sort()

    getTemplate: (id) ->
      questionId = QuestionStore.freshLocalId()

      attachments:[],
      tags:[],
      stimulus_html:"",
      questions:[_.extend({}, QuestionStore.getTemplate(), {id: questionId})]

    validate: (id) ->
      _.reduce @_local[id].questions, (memo, question) ->
        validity = QuestionStore.validate(question.id)

        valid: memo.valid and validity.valid
        reason: memo.reason or validity.reason
      , valid: true

}

extendConfig(ExerciseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ExerciseConfig)

module.exports = {ExerciseActions:actions, ExerciseStore:store}
