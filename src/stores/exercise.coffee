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
    
  sync: (id) ->
    questions = _.map @_local[id].questions, (question) ->
      QuestionActions.sync(question.id)
      QuestionStore.get(question.id)
    @_change(id, {questions})

  save: (id) ->
    @sync(id)
    @_save(id)

  _saved: (obj, id) ->
    cascadeLoad(obj, id)
    @_asyncStatusPublish[id] = false

  publish: (id) ->
    @_asyncStatusPublish[id] = true
    @emitChange()

  deleteAttachment: EmptyFn

  attachmentDeleted: (resp, exerciseUid, attachmentId) ->
    exercise = _.findWhere(@_local, {uid: exerciseUid})
    exercise.attachments = _.reject exercise.attachments, (attachment) -> attachment.id is attachmentId
    @emitChange()


  attachmentUploaded: (uid, attachment) ->
    exercise = _.findWhere(@_local, {uid})
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

}

extendConfig(ExerciseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ExerciseConfig)

module.exports = {ExerciseActions:actions, ExerciseStore:store}
