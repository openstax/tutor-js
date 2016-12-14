CourseInfo = require '../../src/flux/course-information'

describe 'Course Information lookup', ->

  it 'returns info for a valid appearance_code', ->
    expect(CourseInfo.forAppearanceCode('college_biology')).to.deep.equal({
      title: 'College Biology'
      subject: 'Biology'
    })
    undefined

  it 'returns a default values for unknown codes', ->
    expect(CourseInfo.forAppearanceCode('yo_yo_yo')).to.deep.equal({
      title: 'Yo Yo Yo',
      subject: ''
    })
    undefined
