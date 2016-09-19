PERSONALIZED_GROUP = 'personalized'
SPACED_PRACTICE_GROUP = 'spaced practice'

PROJECT_NAME =
  tutor: 'OpenStax Tutor'
  'concept-coach': 'OpenStax Concept Coach'

makeHelpText = {}

makeHelpText[PERSONALIZED_GROUP] = (project, locate = true) ->
  locationText = if locate then '—like this next one—' else ' '

  "
    Personalized questions#{locationText}are chosen specifically
    for you by #{PROJECT_NAME[project]} based on your learning history.
  "

makeHelpText[SPACED_PRACTICE_GROUP] = (project, locate = true) ->
  locationText = if locate then '—like this next one—' else ' '

  "
    Did you know?  Research shows you can strengthen your
    memory—and spend less time studying—if
    you revisit material over multiple study sessions.
      #{PROJECT_NAME[project]} will include review questions
    #{locationText}from prior sections to give your learning a boost.  
    You may occasionally see questions you've seen before.
  "

makeHelpText['two-step'] = (project) ->
  "
    Research shows that a great way to boost your learning is to quiz
    yourself.  For maximum benefit, read the text and then answer the
    free response question in your own words.  Then, select the best
    multiple choice answer so #{PROJECT_NAME[project]} can give you immediate
    feedback.  Both you and your instructor can review your answers later.
  "

module.exports = {PERSONALIZED_GROUP, SPACED_PRACTICE_GROUP, makeHelpText}
