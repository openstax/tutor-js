PERSONALIZED_GROUP = 'personalized'
SPACED_PRACTICE_GROUP = 'spaced practice'
TWO_STEP_ALIAS = 'two-step'

PROJECT_NAME =
  tutor: 'OpenStax Tutor'
  'concept-coach': 'OpenStax Concept Coach'

LABELS = {}
LABELS[PERSONALIZED_GROUP] = 'Personalized'
LABELS[SPACED_PRACTICE_GROUP] = 'Spaced Practice'
LABELS[TWO_STEP_ALIAS] = 'Two-step'

getHelpText = {}

getHelpText[PERSONALIZED_GROUP] = (project, locate = true) ->
  locationText = if locate then '—like this next one—' else ' '

  "
    Personalized questions#{locationText}are chosen specifically
    for you by #{PROJECT_NAME[project]} based on your learning history.
  "

getHelpText[SPACED_PRACTICE_GROUP] = (project, locate = true) ->
  locationText = if locate then '—like this next one—' else ' '

  "
    Did you know?  Research shows you can strengthen your
    memory—and spend less time studying—if
    you revisit material over multiple study sessions.
      #{PROJECT_NAME[project]} will include spaced practice questions
    #{locationText}from prior sections to give your learning a boost.  
    You may occasionally see questions you've seen before.
  "

getHelpText[TWO_STEP_ALIAS] = (project) ->
  "
    Research shows that a great way to boost your learning is to quiz
    yourself.  For maximum benefit, read the text and then answer the
    free response question in your own words.  Then, select the best
    multiple choice answer so #{PROJECT_NAME[project]} can give you immediate
    feedback.  Both you and your instructor can review your answers later.
  "

module.exports = {
  PERSONALIZED_GROUP,
  SPACED_PRACTICE_GROUP,
  TWO_STEP_ALIAS,
  LABELS,
  getHelpText
}
