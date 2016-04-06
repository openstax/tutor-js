_ = require 'underscore'
flux = require 'flux-react'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{AnswerActions, AnswerStore} = require './answer'

__FORMATS =
  freeResponse: 'free-response'
  multipleChoice: 'multiple-choice'

hasFormat = (formats = [], form) ->
  _.find formats, (format) -> format is form

toggleFormat = (formats = [], form) ->
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

  syncAnswers: (id) ->
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
    @syncAnswers(id)

  removeAnswer: (id, answerId) ->
    AnswerActions.delete(answerId)
    answers = _.reject @_local[id]?.answers, (answer) ->
      answer.id is answerId
    @_local[id]?.answers = answers

  moveAnswer: (id, answerId, direction) ->
    index = _.findIndex @_local[id]?.answers, (answer) ->
      answer.id is answerId

    if (index isnt -1)
      temp = @_local[id]?.answers[index]
      @_local[id]?.answers[index] = @_local[id]?.answers[index + direction]
      @_local[id]?.answers[index + direction] = temp

  updateStem: (id, stem_html) -> @_change(id, {stem_html})

  updateStimulus: (id, stimulus_html) -> @_change(id, {stimulus_html})

  updateSolution: (id, feedback) ->
    solution = _.first(@_get(id).collaborator_solutions)
    if (solution)
      solution.content_html = feedback
    else
      solution =
        content_html: feedback
        attachments: []
        solution_type: 'detailed'

    @_change(id, {collaborator_solutions: [solution]})

  setCorrectAnswer: (id, newAnswer, curAnswer) ->
    if not AnswerStore.isCorrect(newAnswer)
      AnswerActions.setCorrect(newAnswer)
      AnswerActions.setIncorrect(curAnswer) if curAnswer

  toggleMultipleChoiceFormat: (id) ->
    newFormats = toggleFormat(@_get(id).formats, __FORMATS.multipleChoice)
    @_change(id, {formats: newFormats})

  toggleFreeResponseFormat: (id) ->
    newFormats = toggleFormat(@_get(id).formats, __FORMATS.freeResponse)
    @_change(id, {formats: newFormats})

  togglePreserveOrder: (id) ->
    @_get(id).is_answer_order_important = not @_get(id).is_answer_order_important


  exports:

    getAnswers: (id) -> @_get(id)?.answers or []

    getStem: (id) -> @_get(id)?.stem_html

    getStimulus: (id) -> @_get(id)?.stimulus_html

    getSolution: (id) ->
      _.first(@_get(id).collaborator_solutions)?.content_html

    getCorrectAnswer: (id) ->
      _.find @_get(id)?.answers, (answer) -> AnswerStore.isCorrect(answer.id)

    isMultipleChoice: (id) ->
      hasFormat(@_get(id).formats, __FORMATS.multipleChoice)
    isFreeResponse: (id) ->
      hasFormat(@_get(id).formats, __FORMATS.freeResponse)
    isOrderPreserved: (id) ->
      @_get(id).is_answer_order_important

    getTemplate: ->
      answerId = AnswerStore.freshLocalId()

      stem_html:"",
      stimulus_html:"",
      collaborator_solutions: [{"content_html": "", "solution_type": "detailed"}],
      answers:[_.extend({}, AnswerStore.getTemplate(), {id: answerId})],
      is_answer_order_important: false

    validate: (id) ->
      if (not @_get(id).stem_html)
        return valid: false, reason: 'Question Stem is invalid'

      _.reduce @_get(id).answers, (memo, answer) ->
        validity = AnswerStore.validate(answer.id)

        valid: memo.valid and validity.valid
        reason: memo.reason or validity.reason
      , valid: true
}

extendConfig(QuestionConfig, new CrudConfig())
{actions, store} = makeSimpleStore(QuestionConfig)

module.exports = {QuestionActions:actions, QuestionStore:store}
