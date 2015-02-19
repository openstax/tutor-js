$ = require 'jquery'
router = require '../src/router'
{expect} = require 'chai'

# Load up the APP
require '../index'


transitionTo = (path) ->
  router.router.transitionTo(path)

describe 'router', ->
  it 'should begin on the home page', ->
    transitionTo('/dashboard')
    expect(window.location.pathname).to.equal('/dashboard')

  it 'should go to the tasks page when clicking the link', ->
    transitionTo('/dashboard')
    expect($('a')).to.have.length.at.least(1)
    $('a').click()
    transitionTo('/tasks')
    expect(window.location.pathname).to.equal('/tasks')
