React = require 'react'
_ = require 'underscore'

PERSONALIZED_GROUP = 'personalized'
SPACED_PRACTICE_GROUP = 'spaced practice'
TWO_STEP_ALIAS = 'two-step'

PROJECT_NAME =
  tutor: 'OpenStax Tutor'
  'concept-coach': 'OpenStax Concept Coach'

PROJECT =
  'concept-coach':
    name: 'Concept Coach'
    feedbackType: 'immediate feedback'
  'tutor':
    name: 'Tutor'
    feedbackType: 'personalized feedback'

LABELS = {}
LABELS[PERSONALIZED_GROUP] = 'Personalized'
LABELS[SPACED_PRACTICE_GROUP] = 'Spaced Practice'
LABELS[TWO_STEP_ALIAS] = 'Two-step'

TITLES = {}
TITLES[PERSONALIZED_GROUP] = "#{LABELS[PERSONALIZED_GROUP]} questions"
TITLES[SPACED_PRACTICE_GROUP] = LABELS[SPACED_PRACTICE_GROUP]
TITLES[TWO_STEP_ALIAS] = "#{LABELS[TWO_STEP_ALIAS]} questions"

ALIASES = {}
ALIASES[PERSONALIZED_GROUP] = PERSONALIZED_GROUP
ALIASES[SPACED_PRACTICE_GROUP] = 'spaced-practice'
ALIASES[TWO_STEP_ALIAS] = TWO_STEP_ALIAS

makeAliases = (suffix) ->
  _.mapObject ALIASES, (alias) -> "#{alias}-#{suffix}"

INTRO_ALIASES = makeAliases('intro')

getProject = (project = 'tutor') ->
  PROJECT[project]

getIntroText = {}

getIntroText[PERSONALIZED_GROUP] = (project, locate = true) ->
  locationText = if locate then '—like this next one—' else ' '

  <p>
    Personalized questions{locationText}are chosen specifically
    for you by {getProject(project).name} based on your learning history.
  </p>

getIntroText[SPACED_PRACTICE_GROUP] = (project, locate = true) ->
  locationText = if locate then '—like this next one—' else ' '

  [
    <p>
      Did you know?  Research shows you can strengthen your
      memory—<strong>and spend less time studying</strong>—if
      you revisit material over multiple study sessions.
    </p>
    <p>
      {getProject(project).name} will include <strong>spaced practice</strong> questions
      {locationText}from prior sections to give your learning a boost.
        You may occasionally see questions you&#39;ve seen before.
    </p>
  ]

getIntroText[TWO_STEP_ALIAS] = (project) ->
  [
    <p>Research shows quizzing yourself is a great way to boost learning.</p>
    <h4>Step 1: Free response</h4>
    <p>
      Read the question, then construct an answer in the
      free response box. Recalling knowledge from memory (rather than looking up
      the answer or recognizing it in a list) helps your learning last longer.
    </p>
    <h4>Step 2: Multiple choice</h4>
    <p>
      Then select the best multiple choice answer so
      {getProject(project).name} can give you {getProject(project).feedbackType}.
    </p>
    <p>
      Both you and your instructor can review your answers later.
    </p>
  ]

getHelpText = _.mapObject(getIntroText, (getIntro) ->
  _.partial(getIntro, _, false)
)

getHelpText[TWO_STEP_ALIAS] = (project) ->
  [
    <p><strong>Why do you ask me to answer twice?</strong></p>
    <p>Research shows that recalling the answer to a question from memory
    helps your learning last longer.  So, {getProject(project).name} asks
    for your own answer first, then gives multiple-choice options
    so you can get {getProject(project).feedbackType}.  Both you and your
    instructor can review your work later.</p>
  ]

getHelpText[SPACED_PRACTICE_GROUP] = (project) ->
  [
    <p><strong>What is spaced practice?</strong></p>
    getIntroText[SPACED_PRACTICE_GROUP](project, false)
  ]

getHelpInfo = (group) ->
  return unless _.contains(_.keys(ALIASES), group)

  label: LABELS[group]
  title: TITLES[group]
  alias: ALIASES[group]
  introAlias: INTRO_ALIASES[group]
  getIntroText: getIntroText[group]
  getHelpText: getHelpText[group]


module.exports = {
  PERSONALIZED_GROUP,
  SPACED_PRACTICE_GROUP,
  TWO_STEP_ALIAS,
  LABELS,
  ALIASES,
  INTRO_ALIASES,
  TITLES,
  makeAliases,
  getHelpText,
  getIntroText,
  getHelpInfo
}
