$ = require 'jquery'
{expect} = require 'chai'

# Load up the APP
require '../index'

describe 'router', ->
  it 'should start at a page', ->
    # For some reason the page is /context.html
    expect($('a')).to.have.length.at.least(1)

  it 'should go to the home page when clicking the link', ->
    $('a').click()
    expect(window.location.pathname).to.equal('/')
