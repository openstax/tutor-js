{React, } = require 'shared/specs/helpers'

ExerciseIdentifierLink = require 'components/exercise-identifier-link'

Exercise = require 'model/exercise'

describe 'Exercise Identifier Link', ->

  beforeEach ->
    @props =
      bookUUID: '27275f49-f212-4506-b3b1-a4d5e3598b99'
      exerciseId: '1234@42'
      project: 'tutor'

  it 'reads the parts from props and sets the url', ->
    link = shallow(<ExerciseIdentifierLink {...@props} />)
    expect(link).toHaveRendered("a[href=\"#{Exercise.BASE_URL}?source=tutor&location=Exercise%3A%201234%4042&book=College%20Physics\"]")
    undefined

  it 'falls back to context if props are missing', ->
    delete @props.bookUUID
    delete @props.project
    link = shallow(<ExerciseIdentifierLink {...@props} />, context: {
      bookUUID: '08df2bee-3db4-4243-bd76-ee032da173e8'
      oxProject: 'TESTING'
    })
    expect(link).toHaveRendered(
      "a[href=\"#{Exercise.BASE_URL}?source=TESTING&location=Exercise%3A%201234%4042&book=Principles%20of%20Microeconomics\"]"
    )
    undefined

  it 'opens in new tab', ->
    link = shallow(<ExerciseIdentifierLink {...@props} />)
    expect(link).toHaveRendered('a[target="_blank"]')
    undefined

  it 'renders the the exercise id before the trouble link', ->
    link = shallow(<ExerciseIdentifierLink {...@props} />)
    expect(link.text()).to.include("ID# #{@props.exerciseId}")
    undefined
