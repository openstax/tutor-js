{Testing, expect, sinon, _} = require 'test/helpers'

ExerciseIdentifierLink = require 'components/exercise-identifier-link'

describe 'Exercise Identifier Link', ->

  beforeEach ->
    @props =
      bookUUID: '27275f49-f212-4506-b3b1-a4d5e3598b99'
      exerciseUID: '1234@42'
      project: 'tutor'

  it 'sets the Book radio button to the correct title', ->
    Testing.renderComponent( ExerciseIdentifierLink, props: @props ).then ({dom}) ->
      expect(dom.querySelector('a').getAttribute('href')).to.match(/Physics/)

  it 'sets CC to No when type is Tutor', ->
    Testing.renderComponent( ExerciseIdentifierLink, props: @props ).then ({dom}) ->
      expect(dom.querySelector('a').getAttribute('href')).to.match(/No/)

  it 'sets CC to Yes when type is CC', ->
    @props.project = 'concept-coach'
    Testing.renderComponent( ExerciseIdentifierLink, props: @props ).then ({dom}) ->
      expect(dom.querySelector('a').getAttribute('href')).to.match(/Yes/)
