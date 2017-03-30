_ = require 'underscore'

{NewCourseStore, NewCourseActions} = require '../../src/flux/new-course'
OFFERINGS = require '../../api/offerings'

describe 'NewCourse Store', ->

  it 'can return a valid api payload', ->
    NewCourseActions.set({
      course_type: 'tutor'
      offering_id: '1'
      cloned_from_id: '11'
      term:
        term: "fall"
        year: 2018
        name: 'Test Course'
        num_sections: 3
    })

    expect(NewCourseStore.requestPayload()).to.deep.equal({
      copy_question_library: true,
      course_type: 'tutor',
      cloned_from_id: '11'
      term: 'fall',
      year: 2018,
      name: 'Test Course',
      num_sections: 3,
      is_preview: false,
      is_college: true
    })

    undefined
