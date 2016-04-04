_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{QuestionActions, QuestionStore} = require './question'

cascadeLoad = (obj, exerciseId) ->
  for question in obj.questions
    QuestionActions.loaded(question, question.id)
  obj

EmptyFn = -> ''

FixedTags = [{
  base: 'blooms'
  range: [1...8]
  separator: '-'
}, {
  base: 'dok'
  range: [1...4]
  separator: ''
}, {
  base: 'time'
  range: ['short', 'medium', 'long']
  separator: '-'
}]


isFixedTagType = (tag, fixedTag) -> tag.indexOf("#{fixedTag.base}#{fixedTag.separator}") isnt -1

getTagTypes = (tags) ->
  #filter out all editable tags
  editable = _.filter tags, (tag) ->
    _.reduce(FixedTags, (memo, fixedTag) ->
      memo and not isFixedTagType(tag, fixedTag)
    , true)

  fixedArray = _.filter tags, (tag) -> editable.indexOf(tag) is -1

  #get all fixed tags with value attribute
  fixed = _.map(FixedTags, (fixedTag) ->
    value = _.reduce(fixedArray, (memo, tag) ->
      if isFixedTagType(tag, fixedTag)
        tag
      else
        memo
    , '')

    _.extend({}, fixedTag, {value})
  )

  #return both types of tags
  return {fixed, editable}

ExerciseConfig = {
  _loaded: cascadeLoad
  _asyncStatusPublish: {}

  updateNumber: (id, number) -> @_change(id, {number})

  updateStimulus: (id, stimulus_html) -> @_change(id, {stimulus_html})

  updateTags: (id, editableTags) ->
    fixedTags = getTagTypes(@_get(id).tags).fixed
    tags = editableTags.concat(_.pluck(fixedTags, 'value'))
    tags = _.filter(tags, (tag) -> tag isnt '')
    @_change(id, {tags})

  updateFixedTag:(id, oldTag, newTag) ->
    tags = @_get(id).tags
    if (not newTag)
      tags = _.filter(tags, (tag) -> tag isnt oldTag)
    else if (not oldTag)
      tags.push(newTag)
    else
      tags = _.filter(tags, (tag) -> tag isnt oldTag)
      tags.push(newTag)

    @_change(id, {tags})

  addBlankPrefixedTag: (id, {prefix}) ->
    prefix += ':'
    tags = _.clone( @_get(id).tags )
    unless 0 is tags.indexOf(prefix) # is there already a blank one?
      tags.push(prefix)
      @_change(id, {tags})


  # these may not be needed
  #
  # removeTag: (id, badTag) ->
  #   tags = @_get(id).tags
  #   cleanedTags = _.without(tags, badTag)
  #   @_change(id, {tags: cleanedTags}) if cleanedTags.length isnt tags.length

  # addTag: (id, tag) ->
  #   tags = @_get(id).tags
  #   tags.push(tag)
  #   console.log "Added: #{tags}"
  #   @_change(id, {tags})

  setPrefixedTag: (id, {prefix, tag, previous}) ->
    prefix += ':'
    tags = _.without(@_get(id).tags, prefix + previous)
    if tag
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

    getEditableTags: (id) -> getTagTypes(@_local[id].tags).editable

    getFixedTags: (id) -> getTagTypes(@_local[id].tags).fixed

    getPublishedDate: (id) -> @_local[id].published_at

    isPublished: (id) -> @_local[id].published_at

    isPublishing: (id) -> !!@_asyncStatusPublish[id]

    getTagsWithPrefix: (id, prefix) ->
      prefix += ':'
      tags = _.select @_get(id).tags, (tag) -> 0 is tag.indexOf(prefix)
      _.map tags, (tag) -> tag.replace(/^[\w\-]+:/, '')

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
