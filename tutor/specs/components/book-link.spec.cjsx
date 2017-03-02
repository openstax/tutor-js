{React, SnapShot} = require './helpers/component-testing'

BookLink = require '../../src/components/qa/book-link'
Context = require './helpers/enzyme-context'


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
    undefined
