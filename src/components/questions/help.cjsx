React = require 'react'

{CourseStore} = require '../../flux/course'
Icon = require '../icon'

TUT_TT1 =
  <span>
    Tutor uses these questions for your assignments, spaced practice, personalization,
    and Performance Forecast practice.
  </span>

TUT_TT2 =
  <span>
    If you want to exclude any questions from a particular section,
    be sure to do so before you assign those sections for reading or homework.
  </span>


TUTOR_HELP =
  first:
    bar:
      <span>
        Select the sections you plan to assign below to review all possible
        questions. <Icon tooltip={TUT_TT1} type="info-circle" />
      </span>
    addon:
      <span>
        You can skip any sections you won’t be covering in your
        course.  Students will never see questions from sections you don’t
        assign. <Icon tooltip={TUT_TT2} type="info-circle" />
      </span>

  second:
    bar:
      <span>
        If you want to exclude any questions, be sure to do so before
        you assign those sections for reading or homework.
      </span>

CC_TT1 =
  <span>
    Concept Coach uses these questions to give students practice.
    After reading a section, students will get questions
    reinforcing that section and <i>and</i> review questions
    reinforcing previously read sections.
  </span>

CC_TT2 =
  <span>
   If you want to exclude any questions, be sure to do so before your students start reading those sections.
  </span>

CC_HELP =
  first:
    bar:
      <span>
        Select the sections you plan to assign below to review all possible questions.
        <Icon tooltip={CC_TT1} type="info-circle" />
      </span>
    addon:
      <span>
        You can skip any sections you won’t be covering in your course.
        Students will only see questions from sections they work on in Concept Coach.
      </span>
  second:
    bar:
      <span>
        If you want to exclude any questions, be sure to do so before your
        students start reading those sections.
      </span>

Help =

  forCourseId: (courseId) ->
    course = CourseStore.get(courseId)
    if course.is_concept_coach then CC_HELP else TUTOR_HELP

module.exports = Help
