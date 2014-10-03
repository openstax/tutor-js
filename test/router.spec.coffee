$ = require 'jquery'
Router = require 'react-router'
{expect} = require 'chai'

# Load up the APP
require '../index'

describe 'router', ->
  it 'should go to the home page', ->
    Router.transitionTo('/dashboard')
    expect(window.location.pathname).to.equal('/dashboard')

  it 'should go to the tasks page when clicking the link', ->
    Router.transitionTo('/dashboard')
    expect($('a')).to.have.length.at.least(1)
    # $('a').click()
    Router.transitionTo('/tasks')
    expect(window.location.pathname).to.equal('/tasks')
