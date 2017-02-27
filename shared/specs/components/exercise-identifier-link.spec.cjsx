{React, } = require 'shared/specs/helpers'

ExerciseIdentifierLink = require 'components/exercise-identifier-link'

BASE = 'https://docs.google.com/a/rice.edu/forms/d/e/1FAIpQLSd5rLsdKv75nkpary6dfJMRuw0bcqSetYV3hO-pFbzqqplM0Q/viewform'

describe 'Exercise Identifier Link', ->

  beforeEach ->
    @props =
      bookUUID: '27275f49-f212-4506-b3b1-a4d5e3598b99'
      exerciseId: '1234@42'
      project: 'tutor'

  it 'reads the parts from props and sets the url', ->
    link = shallow(<ExerciseIdentifierLink {...@props} />)
    expect(link).toHaveRendered("a[href=\"#{BASE}?entry.649352110=1234%4042&entry.1091629000=College%20Physics\"]")
    undefined

  it 'falls back to context if props are missing', ->
    delete @props.bookUUID
    delete @props.project
    link = shallow(<ExerciseIdentifierLink {...@props} />, context: {
      bookUUID: '08df2bee-3db4-4243-bd76-ee032da173e8'
      oxProject: 'TESTING'
    })
    expect(link).toHaveRendered(
      "a[href=\"#{BASE}?entry.649352110=1234%4042&entry.1091629000=Principles%20of%20Microeconomics\"]"
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
