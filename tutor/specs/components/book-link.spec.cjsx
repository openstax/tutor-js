{React, SnapShot} = require './helpers/component-testing'

BookLink = require '../../src/components/qa/book-link'
Context = require './helpers/enzyme-context'

# {ExerciseActions, ExerciseStore} = require '../../src/flux/exercise'
# {EcosystemsActions, EcosystemsStore} = require '../../src/flux/ecosystems'
# {ReferenceBookActions, ReferenceBookStore} = require '../../src/flux/reference-book'

# EXERCISES  = require '../../api/exercises.json'
# ECOSYSTEMS = require '../../api/ecosystems.json'
# PAGE = require '../../api/ecosystems/3/readings.json'
# COURSE_ID = '1'
# ECOSYSTEM_ID = '3'
# CNX_ID = '17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12'


describe 'QA Exercises Book Link', ->

  beforeEach ->
    @props =
      book:
        ecosystemId: '1'
        title: 'A Title'
        version: '1.1'
        ecosystemComments: 'Test Eco'

  it 'renders', ->
    wrapper = shallow(<BookLink {...@props} />, Context.build())
    console.log wrapper.debug()
    undefined
