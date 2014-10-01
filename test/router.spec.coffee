$ = require 'jquery'
{history} = require 'backbone'
{expect} = require 'chai'

# Load up the APP
require '../index'

# Helper for triggering URL updates
navigate = (path) ->
  history.navigate(path, {trigger:true})

describe 'router', ->
  it 'should go to the home page', ->
    navigate('/dashboard')
    expect(window.location.pathname).to.equal('/dashboard')

  it 'should go to the tasks page when clicking the link', ->
    navigate('/dashboard')
    expect($('a')).to.have.length.at.least(1)
    $('a').click()
    expect(window.location.pathname).to.equal('/tasks')
