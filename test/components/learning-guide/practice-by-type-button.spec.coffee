{Testing, expect, _} = require '../helpers/component-testing'

LearningGuide = require '../../../src/flux/learning-guide'
Button = require '../../../src/components/learning-guide/practice-by-type-button'

COURSE_ID  = '1'
GUIDE_DATA = require '../../../api/courses/1/guide.json'

describe 'Learning Guide Practice Button', ->

  beforeEach ->
    LearningGuide.Student.actions.loaded(GUIDE_DATA, COURSE_ID)

  it 'can be rendered and sets the name', ->
    Testing.renderComponent( Button,
      props: { courseId: COURSE_ID, practiceType: 'weaker', practiceTitle: 'Practice moar' }
    ).then ({dom}) ->
      expect(dom.textContent).to.equal('Practice moar')


  it 'practices weakest pages', ->
    Testing.renderComponent( Button,
      props: { courseId: COURSE_ID, practiceType: 'stronger', practiceTitle: 'Practice moar' }
    ).then ({dom}) ->
      Testing.actions.click(dom)
      expect(Testing.router.transitionTo).to.have.been.calledWith( 'viewPractice',
        { courseId: COURSE_ID }, { page_ids: ['2', '3'] }
      )

  it 'practices stronger pages', ->
    Testing.renderComponent( Button,
      props: { courseId: COURSE_ID, practiceType: 'weaker', practiceTitle: 'Practice moar' }
    ).then ({dom}) ->
      Testing.actions.click(dom)
      expect(Testing.router.transitionTo).to.have.been.calledWith( 'viewPractice',
        { courseId: COURSE_ID }, { page_ids: ['6', '5'] }
      )

  it 'is disabled if no page ids exist', ->
    newdata = {"title": "Physics"}
    LearningGuide.Student.actions.loaded(newdata, COURSE_ID)
    Testing.renderComponent( Button,
      props: { courseId: COURSE_ID, practiceType: 'weaker', practiceTitle: 'title' }
    ).then ({dom, element}) ->
      expect(_.toArray dom.classList).to.include('disabled')
