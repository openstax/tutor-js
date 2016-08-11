_ = require 'underscore'
htmlparser = require 'htmlparser2'
{makeSimpleStore} = require './helpers'

TEXT_LENGTH_CHECK = 110
TEXT_LENGTH = 125
TEXT_CHECK_RANGE = TEXT_LENGTH - TEXT_LENGTH_CHECK

isLabel = (element) ->
  element.attribs['data-has-label'] is 'true'
isTitle = (element) ->
  element.attribs['data-type'] is 'title'
grabLabel = (element) ->
  element.attribs['data-label']?.trim?()
grabTitle = (element) ->
  element.children?[0]?.data?.trim?()

isMaths = (element) ->
  element.attribs?['data-math']?

grabTruncatedText = (text, start = TEXT_LENGTH_CHECK, range = TEXT_CHECK_RANGE) ->
  end = start + range
  if text.length >= end
    textEnd = start + text.substring(start, end).indexOf(' ')
    text = "#{text.substring(0, textEnd)}..."
  text

keepMathsOnly = (element) ->
  if isMaths(element)
    return element
  else
    return htmlparser.DomUtils.getText(element)

getLengthFromTextOrMaths = (element) ->
  htmlparser.DomUtils.getText(element)?.length or 0

StepTitleConfig =

  _local: {}

  loaded: (id, title) ->
    @_local[id] = title
    @emit("loaded.#{id}", title)

  _parseReading: (actions, id, error, dom) ->
    title = htmlparser.DomUtils.findOne(isTitle, dom, false)

    if title?
      text = grabTitle(title)
    else
      label = htmlparser.DomUtils.findOne(isLabel, dom, false)
      text = grabLabel(label) if label?

    text ?= grabTruncatedText(htmlparser.DomUtils.getText(dom))

    actions.loaded(id, text)

  _parseExercise: (actions, id, error, dom) ->
    text = grabTruncatedText(htmlparser.DomUtils.getText(dom))

    maths = htmlparser.DomUtils.findOne(isMaths, dom, false)

    unless maths?
      text = grabTruncatedText(htmlparser.DomUtils.getText(dom))
    else
      simpleExercise = htmlparser.DomUtils.find(keepMathsOnly, dom, false)
      exerciseLength = 0

      truncatedExercise = _.filter simpleExercise, (part) ->
        return false if exerciseLength > TEXT_LENGTH
        exerciseLength += getLengthFromTextOrMaths(part)
        return true

      if exerciseLength >= TEXT_LENGTH
        lastPart = _.last(truncatedExercise)

        if lastPart.type is 'text'
          start = Math.max(exerciseLength - TEXT_LENGTH, 0) if truncatedExercise.length > 1
          lastPart.data = grabTruncatedText(lastPart.data, start)
          truncatedExercise[truncatedExercise.length - 1] = lastPart
        else
          truncatedExercise.push({data: '...', type: 'text'})

      text = htmlparser.DomUtils.getOuterHTML(truncatedExercise)

    actions.loaded(id, text)

  parseReading: (id, htmlString) ->
    unless @_get(id)?
      parseHandler = new htmlparser.DomHandler _.partial(@_parseReading, @, id)
      titleParser = new htmlparser.Parser(parseHandler)
      titleParser.parseComplete(htmlString)

  parseExercise: (id, htmlString) ->
    unless @_get(id)?
      parseHandler = new htmlparser.DomHandler _.partial(@_parseExercise, @, id)
      titleParser = new htmlparser.Parser(parseHandler)
      titleParser.parseComplete(htmlString)

  parseStep: (step) ->
    if step.type is 'reading'
      @parseReading(step.id, step.content_html)
    if step.type is 'exercise'
      @parseExercise(step.id, _.first(step.content.questions).stem_html)

  parseSteps: (steps) ->
    _.each steps, @parseStep, @

  _get: (id) ->
    @_local[id]

  reset: ->
    @_local = {}

  exports:
    get: (id) -> @_get(id)
    isLoaded: (id) -> @_get(id)?

{actions, store} = makeSimpleStore(StepTitleConfig)
module.exports = {StepTitleActions:actions, StepTitleStore:store}