{React, Testing, expect, sinon} = require './helpers/component-testing'

CourseGroupingLabel = require '../../src/components/course-grouping-label'

COURSE_ID = '1'
COURSE    = require '../../api/user/courses/1.json'
{CourseActions} = require '../../src/flux/course'

describe 'CourseGroupingLabel', ->

  describe 'A non concept coach course', ->
    beforeEach ->
      CourseActions.loaded(COURSE, COURSE_ID)

    it 'renders as period', ->
      Testing.renderComponent( CourseGroupingLabel, props: {courseId: COURSE_ID} ).then ({element, dom}) ->
        expect(dom.innerText).to.equal('Period')

    it 'can render as lowercase', ->
      Testing.renderComponent( CourseGroupingLabel, props: {courseId: COURSE_ID, lowercase:true} ).then ({element, dom}) ->
        expect(dom.innerText).to.equal('period')

    it 'can be pluralized', ->
      Testing.renderComponent( CourseGroupingLabel, props: {courseId: COURSE_ID, plural:true} ).then ({element, dom}) ->
        expect(dom.innerText).to.equal('Periods')

    it 'can be pluralized and lowercase', ->
      Testing.renderComponent( CourseGroupingLabel, props: {courseId: COURSE_ID, plural:true, lowercase:true} )
        .then ({element, dom}) ->
          expect(dom.innerText).to.equal('periods')

  describe 'A concept coach course', ->
    beforeEach ->
      CourseActions.loaded(_.extend(COURSE, is_concept_coach: true), COURSE_ID)

    it 'renders as section', ->
      Testing.renderComponent( CourseGroupingLabel, props: {courseId: COURSE_ID} ).then ({element, dom}) ->
        expect(dom.innerText).to.equal('Section')

    it 'can render as lowercase', ->
      Testing.renderComponent( CourseGroupingLabel, props: {courseId: COURSE_ID, lowercase:true} ).then ({element, dom}) ->
        expect(dom.innerText).to.equal('section')

    it 'can be pluralized', ->
      Testing.renderComponent( CourseGroupingLabel, props: {courseId: COURSE_ID, plural:true} ).then ({element, dom}) ->
        expect(dom.innerText).to.equal('Sections')

    it 'can be pluralized and lowercase', ->
      Testing.renderComponent( CourseGroupingLabel, props: {courseId: COURSE_ID, plural:true, lowercase:true} )
        .then ({element, dom}) ->
          expect(dom.innerText).to.equal('sections')
