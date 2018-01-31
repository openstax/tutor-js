_ = require 'underscore'
unescape = require 'lodash/unescape'
htmlparser = require 'htmlparser2'
{makeSimpleStore} = require './helpers'
{ StepHelpsHelper} = require 'shared'

TEXT_LENGTH_CHECK = 110
TEXT_LENGTH = 125
TEXT_CHECK_RANGE = TEXT_LENGTH - TEXT_LENGTH_CHECK
{
  PERSONALIZED_GROUP,
  INDIVIDUAL_REVIEW,
  SPACED_PRACTICE_GROUP,
  TWO_STEP_ALIAS,
  INTRO_ALIASES,
  TITLES
} = StepHelpsHelper

isLearningObjectives = (element) ->
  (element?.attribs?['class']? and
    element.attribs['class'].search(/learning-objectives/) > -1) or
    element.attribs['data-type'] is 'abstract'

isTypedClass = (element) ->
  element?.attribs?['class']? and
    element.attribs['class'].search(/learning-objectives|references|ap-connection|solution/) > -1

isTipsForSuccess = (element) ->
  element?.attribs?['class']? and element.attribs['class'].search(/tips-for-success/) > -1

isCaption = (element) ->
  element.name is 'caption'

isNote = (element) ->
  return unless element?.attribs?['class']? or element.attribs['data-element-type']?

  classes = element.attribs['class'].split(' ')
  not _.isEmpty(_.intersection(classes, ['note', 'example', 'grasp-check'])) or
    element.attribs['data-element-type'] is 'check-understanding'

isTyped = (element) ->
  element?.attribs?['data-element-type']?

isLabel = (element) ->
  element.attribs['data-has-label'] is 'true' and
    not isTipsForSuccess(element)

isTitle = (element) ->
  element.attribs['data-type'] is 'title' and
    not isTyped(element.parent) and
    not isTypedClass(element.parent) and
    not isCaption(element.parent)

isDocumentTitle = (element) ->
  element.attribs['data-type'] is 'document-title'

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
  _meta: {}

  loaded: (id, title) ->
    @_local[id] = title
    @emit("loaded.#{id}", title)

  loadedMetaData: (contentId, metaData = {}) ->
    metaData = _.extend({
      hasLearningObjectives: false
    }, metaData)

    @_meta[contentId] = metaData

  _parseMeta: (actions, contentId, error, dom) ->
    learningObjectives = htmlparser.DomUtils.findOne(isLearningObjectives, dom, false)
    meta =
      hasLearningObjectives: learningObjectives?

    actions.loadedMetaData(contentId, meta)

  _parseReading: (actions, id, error, dom) ->
    title = htmlparser.DomUtils.findOne(isTitle, dom, false)
    meta = actions._parseMeta(actions, id, error, dom)

    if title?
      text = grabTitle(title)
    else
      label = htmlparser.DomUtils.findOne(isLabel, dom, false)
      text = grabLabel(label) if label?

    actions.loaded(id, unescape(text))

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
    actions.loadedMetaData(id)

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
    if step.type is 'exercise'
      @parseExercise(step.id, _.first(step.content.questions).stem_html)
    else
      @parseReading(step.id, step.content_html)

  parseSteps: (steps) ->
    _.each steps, @parseStep, @

  parseMetaOnly: (contentId, htmlString) ->
    unless @_meta[contentId]?
      parseHandler = new htmlparser.DomHandler _.partial(@_parseMeta, @, contentId)
      metaParser = new htmlparser.Parser(parseHandler)
      metaParser.parseComplete(htmlString)

  _get: (id) ->
    @_local[id]

  reset: ->
    @_local = {}
    @_meta = {}

  exports:
    get: (id) -> @_get(id)
    isLoaded: (id) -> @_get(id)?

    hasLearningObjectives: (contentId) -> @_meta[contentId]?.hasLearningObjectives

    getTitleForCrumb: (crumb) ->
      return '' unless crumb
      if crumb.id and store.get(crumb.id)
        return store.get(crumb.id)
      if crumb.type is 'reading' and crumb.related_content?[0]?.title?
        relatedTitle = crumb.related_content[0].title

        if title is 'Summary'
          title = "#{title} of #{relatedTitle}"
        else if not title
          title = relatedTitle
      else
        switch crumb.type
          when 'end'
            "#{crumb.task.title} Completed"
          when 'coach'
            TITLES[SPACED_PRACTICE_GROUP]
          when INTRO_ALIASES[SPACED_PRACTICE_GROUP]
            TITLES[SPACED_PRACTICE_GROUP]
          when INTRO_ALIASES[PERSONALIZED_GROUP]
            TITLES[PERSONALIZED_GROUP]
          when INTRO_ALIASES[TWO_STEP_ALIAS]
            TITLES[TWO_STEP_ALIAS]
          when INTRO_ALIASES[INDIVIDUAL_REVIEW]
            TITLES[INDIVIDUAL_REVIEW]

{actions, store} = makeSimpleStore(StepTitleConfig)
module.exports = {StepTitleActions:actions, StepTitleStore:store}
