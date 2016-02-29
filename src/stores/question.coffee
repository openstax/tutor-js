_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{AnswerActions, AnswerStore} = require './answer'

__FORMATS =
  freeResponse: 'free-response'
  multipleChoice: 'multiple-choice'

hasFormat = (formats, form) ->
  _.find formats, (format) -> format is form

toggleFormat = (formats, form) ->
  if hasFormat(formats, form)
    _.reject formats, (format) -> format is form
  else
    formats.push(form)
    return formats

QuestionConfig = {
  _loaded: (obj, id) ->
    for answer in obj?.answers
      AnswerActions.loaded(answer, answer.id)

    obj

  sync: (id) ->
    answers = _.map @_local[id]?.answers, (answer) ->
      AnswerStore.get(answer.id)
    @_change(id, {answers})
    
  addNewAnswer: (id) ->
    newAnswer =
      id: AnswerStore.freshLocalId()
      correctness: "0.0"
      feedback_html: ''
      content_html: ''

    AnswerActions.created(newAnswer, newAnswer.id)
    answers = @_local[id]?.answers.push(newAnswer)
    @sync(id)

  removeAnswer: (id, answerId) ->
    AnswerActions.delete(answerId)
    answers = _.reject @_local[id]?.answers, (answer) ->
      answer.id is answerId
    @_local[id]?.answers = answers
    @sync(id)

  moveAnswer: (id, answerId, direction) ->
    index = _.findIndex @_local[id]?.answers, (answer) ->
      answer.id is answerId

    if (index isnt -1)
      temp = @_local[id]?.answers[index]
      @_local[id]?.answers[index] = @_local[id]?.answers[index + direction]
      @_local[id]?.answers[index + direction] = temp

    @sync(id)
      
  updateStem: (id, stem_html) -> @_change(id, {stem_html})

  updateStimulus: (id, stimulus_html) -> @_change(id, {stimulus_html})

  updateFeedback: (id, feedback) ->
    solution = _.first(@_local[id].solutions)
    solution.content_html = feedback

    @_change(id, {solutions: [solution]})

  setCorrectAnswer: (id, newAnswer, curAnswer) ->
    if not AnswerStore.isCorrect(newAnswer)
      AnswerActions.setCorrect(newAnswer)
      AnswerActions.setIncorrect(curAnswer) if curAnswer

  toggleMultipleChoiceFormat: (id) ->
    newFormats = toggleFormat(@_local[id].formats, __FORMATS.multipleChoice)
    @_change(id, {formats: newFormats})

  toggleFreeResponseFormat: (id) ->
    newFormats = toggleFormat(@_local[id].formats, __FORMATS.freeResponse)
    @_change(id, {formats: newFormats})

  togglePreserveOrder: (id) ->
    @_local[id].is_answer_order_important = not @_local[id].is_answer_order_important

  exports:

    getAnswers: (id) -> @_local[id]?.answers or []

    getStem: (id) -> @_local[id]?.stem_html

    getStimulus: (id) -> @_local[id]?.stimulus_html

    getFeedback: (id) ->
      _.first(@_local[id].solutions)?.content_html

    hasFeedback: (id) ->
      @_local[id].solutions?.length > 0

    getCorrectAnswer: (id) ->
      _.find @_local[id]?.answers, (answer) -> AnswerStore.isCorrect(answer.id)

    isMultipleChoice: (id) ->
      hasFormat(@_local[id].formats, __FORMATS.multipleChoice)
    isFreeResponse: (id) ->
      hasFormat(@_local[id].formats, __FORMATS.freeResponse)
    isOrderPreserved: (id) ->
      @_local[id].is_answer_order_important

}

extendConfig(QuestionConfig, new CrudConfig())
{actions, store} = makeSimpleStore(QuestionConfig)

module.exports = {QuestionActions:actions, QuestionStore:store}
