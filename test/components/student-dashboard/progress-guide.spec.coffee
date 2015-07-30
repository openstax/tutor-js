{Testing, expect, _, ReactTestUtils} = require '../helpers/component-testing'

LearningGuide = require '../../../src/flux/learning-guide'

Guide = require '../../../src/components/student-dashboard/progress-guide'

COURSE_ID  = '1'
GUIDE_DATA = require '../../../api/courses/1/guide.json'

describe 'Student Dashboard Progress Panel', ->

  it 'renders practice button', ->
    LearningGuide.Student.actions.loaded(GUIDE_DATA, COURSE_ID)
    Testing.renderComponent( Guide,
      props: { courseId: COURSE_ID }
    ).then ({dom, element}) ->
      expect(dom).not.to.be.null
      expect(dom.querySelector('button.practice')).not.to.be.null

  it 'is disabled if performance report sections are empty', ->
    LearningGuide.Student.actions.loaded({"title": "Physics"}, COURSE_ID)
    Testing.renderComponent( Guide,
      props: { courseId: COURSE_ID }
    ).then ({dom, element}) ->
      expect(_.toArray(dom.classList)).to.include('empty')

  it 'views the guide', ->
    LearningGuide.Student.actions.loaded(GUIDE_DATA, COURSE_ID)
    Testing.renderComponent( Guide,
      props: { courseId: COURSE_ID }
    ).then ({dom, element}) ->
      Testing.actions.click(dom.querySelector('.view-learning-guide'))
      expect(Testing.router.transitionTo).to.have.been.calledWith(
        'viewGuide', { courseId: COURSE_ID }
      )
