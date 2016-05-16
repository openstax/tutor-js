React = require 'react'

{CourseStore} = require '../../flux/course'

CC_HELP = '''
By default, Concept Coach will use all questions in the Library
to deliver practice questions to your students.
The Library gives you the option to exclude questions from your
students' experiences. However, please note that you will
not be able to exclude questions from assignments or
scores once your students start using Concept Coach.
'''

TUTOR_HELP = '''
    Tutor uses these questions for your assignments,
    spaced practice, personalization, and Performance Forecast practice.
'''


CC_SECONDARY_HELP = <div className="secondary-help">
  <b>Best Practice:</b>
  Exclude desired questions <u>before</u> giving students access to Concept Coach.
</div>



Help =

  forCourseId: (courseId) ->
    course = CourseStore.get(courseId)
    primary = if course.is_concept_coach then CC_HELP else TUTOR_HELP
    secondary = if course.is_concept_coach then CC_SECONDARY_HELP else null

    {primary, secondary}

module.exports = Help
