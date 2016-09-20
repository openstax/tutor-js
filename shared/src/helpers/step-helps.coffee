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

getIntroText = {}

getIntroText[PERSONALIZED_GROUP] = (project, locate = true) ->
  locationText = if locate then '—like this next one—' else ' '

  "
    Personalized questions#{locationText}are chosen specifically
    for you by #{PROJECT[project].name} based on your learning history.
  "

getIntroText[SPACED_PRACTICE_GROUP] = (project, locate = true) ->
  locationText = if locate then '—like this next one—' else ' '

  "
    Did you know?  Research shows you can strengthen your
    memory—**and spend less time studying**—if
    you revisit material over multiple study sessions.
    \n\n
    #{PROJECT[project].name} will include **spaced practice** questions
    #{locationText}from prior sections to give your learning a boost.  
    You may occasionally see questions you've seen before.
  "

getIntroText[TWO_STEP_ALIAS] = (project) ->
  "
    Research shows that a great way to boost your learning is to quiz
    yourself.  For maximum benefit, read the text and then answer the
    free response question in your own words.  Then, select the best
    multiple choice answer so #{PROJECT[project].name} can give you 
    #{PROJECT[project].feedbackType}.  
    Both you and your instructor can review your answers later.
  "

getHelpText = _.mapObject(getIntroText, (getIntro) ->
  _.partial(getIntro, _, false)
)

getHelpText[TWO_STEP_ALIAS] = (project) ->
  "
    **Why do you ask me to answer twice?**
    \n\n
    Research shows that recalling the answer to a question from memory helps your learning last longer.  
    So, #{PROJECT[project].name} asks for your own answer first, 
    then gives multiple-choice options so you can get #{PROJECT[project].feedbackType}.  
    Both you and your instructor can review your work later.
  "

getHelpText[SPACED_PRACTICE_GROUP] = (project) ->
  "
    **What is spaced practice?**
    \n\n
    #{getIntroText[SPACED_PRACTICE_GROUP](project, false)}
  "

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
