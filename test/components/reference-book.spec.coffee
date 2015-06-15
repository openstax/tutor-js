_              = require 'underscore'
{expect}       = require 'chai'
React          = require 'react'
{Promise}      = require 'es6-promise'
{TimeActions}  = require '../../src/flux/time'
ReactAddons    = require 'react/addons'
ReactTestUtils = React.addons.TestUtils
{routerStub}   = require './helpers/utilities'

{ReferenceBookActions, ReferenceBookStore} = require '../../src/flux/reference-book'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../src/flux/reference-book-page'
ReferenceBook = require '../../src/components/reference-book/reference-book'

COURSE_ID = '1'
TOC  = require '../../api/courses/1/readings.json'
PAGE_ID = '0e58aa87-2e09-40a7-8bf3-269b2fa16509'
PAGE = require '../../api/pages/0e58aa87-2e09-40a7-8bf3-269b2fa16509.json'


renderBook = (page) ->
  new Promise (resolve, reject) ->
    url = "/book/#{COURSE_ID}"
    url += "/page/#{page}" if page
    routerStub.goTo(url).then( (result) ->
      resolve(_.extend({
        book: ReactTestUtils.findRenderedComponentWithType(result.component, ReferenceBook)
      }, result))
    , (err) ->
      console.err err
    )

describe 'Reference Book Component', ->

  beforeEach ->
    ReferenceBookActions.loaded(TOC, COURSE_ID)
    ReferenceBookPageActions.loaded(PAGE, PAGE_ID)
    renderBook(PAGE_ID).then (state) =>
      @state = state

  it 'renders the section title on the navbar',  ->
    expect(@state.div.querySelector('.section-title').textContent)
      .to.match(/1\.1/)

  it 'renders page html', ->
    expect(@state.div.querySelector('.page').textContent)
      .to.equal('A bunch of html')
