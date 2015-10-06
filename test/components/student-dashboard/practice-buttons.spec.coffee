{Testing, expect, _, ReactTestUtils} = require '../helpers/component-testing'

PerformanceForecast = require '../../../src/flux/performance-forecast'
Buttons = require '../../../src/components/student-dashboard/practice-buttons'

COURSE_ID  = '1'
GUIDE_DATA = require '../../../api/courses/1/guide.json'

describe 'Learning Guide Practice Buttons', ->
  it 'renders practice button', ->
    PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID)
    Testing.renderComponent( Buttons,
      props: { courseId: COURSE_ID }
    ).then ({dom, element}) ->
      expect(dom).not.to.be.null
      expect(dom.querySelector('button.practice')).not.to.be.null


  it 'are disabled if Student Scores sections are empty', ->
    PerformanceForecast.Student.actions.loaded({"title": "Physics"}, COURSE_ID)
    Testing.renderComponent( Buttons,
      props: { courseId: COURSE_ID }
    ).then ({dom, element}) ->
      expect(dom).to.be.null
