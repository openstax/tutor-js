_ = require 'underscore'
htmlparser = require 'htmlparser2'
{makeSimpleStore} = require './helpers'

TEXT_LENGTH_CHECK = 115
TEXT_LENGTH = 125

isLabel = (element) ->
  element.attribs['data-has-label'] is 'true'
isTitle = (element) ->
  element.attribs['data-type'] is 'title'
grabLabel = (element) ->
  element.attribs['data-label']?.trim?()
grabTitle = (element) ->
  element.children?[0]?.data?.trim?()

grabTruncatedText = (text) ->
  if text.length > TEXT_LENGTH
    textEnd = TEXT_LENGTH_CHECK + text.substring(TEXT_LENGTH_CHECK, TEXT_LENGTH).indexOf(' ')
    text = "#{text.substring(0, textEnd)}..."

  text

StepTitleConfig =

  _local: {}

  loaded: (id, title) ->
    @_local[id] = title
    @emit("loaded.#{id}", title)

  _parseHandler: (actions, id, error, dom) ->
    text = grabTruncatedText(htmlparser.DomUtils.getText(dom))

    title = htmlparser.DomUtils.findOne(isTitle, dom, false)
    textParts = []

    if title?
      textParts.push(grabTitle(title))
    else
      label = htmlparser.DomUtils.findOne(isLabel, dom, false)
      textParts.push(grabLabel(label)) if label?

    textParts = _.compact(textParts)

    text = textParts.join(': ') unless _.isEmpty(textParts)
    actions.loaded(id, text)

  parseReading: (id, htmlString) ->
    unless @_get(id)?
      parseHandler = new htmlparser.DomHandler _.partial(@_parseHandler, @, id)
      titleParser = new htmlparser.Parser(parseHandler)
      titleParser.parseComplete(htmlString)

  parseExercise: (id, htmlString) ->
    unless @_get(id)?
      parseHandler = new htmlparser.DomHandler _.partial(@_parseHandler, @, id)
      titleParser = new htmlparser.Parser(parseHandler)
      titleParser.parseComplete(htmlString)

  parseSteps: (steps) ->
    _.each steps, (step) =>
      if step.type is 'reading'
        @parseReading(step.id, step.content_html)
      if step.type is 'exercise'
        @parseExercise(step.id, _.first(step.content.questions).stem_html)

  _get: (id) ->
    @_local[id]

  reset: ->
    @_local = {}

  exports:
    get: (id) -> @_get(id)
    isLoaded: (id) -> @_get(id)?

{actions, store} = makeSimpleStore(StepTitleConfig)
module.exports = {StepTitleActions:actions, StepTitleStore:store}